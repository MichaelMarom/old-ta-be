const { v4: uuidv4 } = require("uuid");
const account = process.env.AZURE_ACCOUNT_NAME;
const { sendErrors } = require("../utils/handleReqErrors");

const formidable = require("formidable");
const { exec } = require("child_process");

const fs = require("fs");
const { BlobServiceClient } = require("@azure/storage-blob");

const { path } = require("../modules");
const {
  deleteBlobsWithPrefix,
  deleteFolderContents,
  deleteBlobWithName,
} = require("../utils/generalHelperFunctions");

const { PassThrough } = require("stream");
const { socket } = require('../modules')

const { AZURE_CONT_BLOB_CODES } = require("../constants/common");

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net/?${process.env.AZURE_BLOB_SAS_TOKEN}`
);

const uploadImageController = async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(
      AZURE_CONT_BLOB_CODES[req.body.container]
    );
    const { userId } = req.params;
    if (!req.file || !req.file.mimetype.startsWith("image/")) {
      return res.status(400).send({ message: "Please upload an image file" });
    }

    if (!userId) {
      return res.status(400).send({ message: "Please provide a user id" });
    }

    //delete previous user image/ to replace with new one
    await deleteBlobsWithPrefix(containerClient, userId);

    const blobName = `${userId}-${uuidv4()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const filePath = path.join(__dirname, `../${req.file.path}`);

    await blockBlobClient.uploadFile(filePath);
    const folderPath = path.join(__dirname, "../profileImgs");
    deleteFolderContents(folderPath);
    res.status(200).send({
      message: "Image uploaded successfully",
      url: `https://${account}.blob.core.windows.net/${AZURE_CONT_BLOB_CODES[req.body.container]
        }/${blobName}`,
    });
  } catch (err) {
    console.error(err);
    res;
    sendErrors(uploadError, res);
  }
};

const uploadTutorDocs = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    const file = files.file[0];
    const containerName = fields.container[0];
    const userId = fields.userId[0];
    const fileType = fields.fileType?.[0] || "degree";
    const existingFileName = fields.existingFileName?.[0];

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const containerClient = blobServiceClient.getContainerClient(
        AZURE_CONT_BLOB_CODES[containerName]
      );
      const fileName = `${userId}-${fileType}-${new Date().getTime()}-${file.originalFilename
        }`;
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      !!existingFileName &&
        (await deleteBlobWithName(containerClient, existingFileName));

      const fileStream = fs.createReadStream(file.filepath);
      await blockBlobClient.uploadStream(fileStream);

      return res.status(200).json({
        message: "File uploaded successfully",
        fileName,
        url: blockBlobClient.url.split("?")[0],
      });
    } catch (uploadError) {
      console.error(uploadError);
      sendErrors(uploadError, res);
    }
  });
};

const recordVideoController = async (req, res) => {
  try {
    const { user_id, upload_type } = req.body;
    const io = req.app.get("socketio");

    if (!req.file || !req.file.mimetype.startsWith("video/")) {
      return sendErrors({ message: "Please upload a video file" }, res);
    }

    if (!user_id) {
      return sendErrors({ message: "Please provide a user id" }, res);
    }

    // Mirror the video horizontally using ffmpeg if needed
    const outputFileName = `interviews/${user_id}-${new Date().getTime()}.${req.file.mimetype.split("/")[1]
      }`;

    let command;
    if (upload_type === "record") {
      command = `ffmpeg -y -i ${req.file.path} -vf "hflip" ${outputFileName}`;
    } else {
      command = `ffmpeg -y -i ${req.file.path} ${outputFileName}`;
    }

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return res.status(500).send({
          message: "Failed to upload the video. The video may be corrupted.",
          reason: error.message,
        });
      }

      // Delete the original non-flipped video
      const del_command = `${process.env.NODE_ENV === "production" ? "rm" : "del"
        } ${req.file.path}`;

      exec(del_command, async (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          return res.status(500).send({ reason: error.message });
        }

        const containerClientForTutorVideos = blobServiceClient.getContainerClient(
          AZURE_CONT_BLOB_CODES[req.body.containerName]
        );

        // Use to delete old videos with the same user_id prefix
        await deleteBlobsWithPrefix(containerClientForTutorVideos, user_id);

        // Set up the Azure Blob client and create a stream
        const blobClient = containerClientForTutorVideos.getBlockBlobClient(
          `${user_id}-${new Date().getTime()}.${req.file.mimetype.split("/")[1]
          }`
        );

        const fileSize = fs.statSync(outputFileName).size;
        const uploadStream = fs.createReadStream(outputFileName);
        const progressStream = new PassThrough();

        // WebSocket or Socket.IO can be used here to send progress updates
        // Assuming `socket` is the connected socket from the frontend

        let uploadedBytes = 0;
        progressStream.on("data", (chunk) => {
          uploadedBytes += chunk.length;
          const progress = Math.round((uploadedBytes / fileSize) * 100);
          io.emit("uploadProgress", { progress });
        });

        // Pipe the upload through progressStream for tracking
        uploadStream.pipe(progressStream);

        // Upload to Azure with progress tracking
        await blobClient.uploadStream(progressStream, undefined, undefined, {
          onProgress: (progress) => {
            io.emit("uploadProgress", {
              progress: Math.round((progress.loadedBytes / fileSize) * 100),
            });
          },
        });

        // Clean up local files
        const folderPath = path.join(__dirname, "../interviews");
        await deleteFolderContents(folderPath);

        res.send({
          message: "Video flipped and uploaded successfully",
          url: blobClient.url.split("?")[0],
        });
      });
    });
  } catch (err) {
    sendErrors(err, res);
  }
};



const uploadVideoWOExec = async (req, res) => {
  const form = new formidable.IncomingForm({
  });

  const io = req.app.get("socketio");


  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).send('Error parsing the file');
      return;
    }

    const file = files.file[0];
    const filename = `${fields.user_id[0]}-${new Date().getTime()}.${files.file[0].mimetype.split("/")[1]}`;

    uploadToAzure(file, filename, io,fields.containerName[0] )
      .then((result) => {
        io.emit('uploadComplete', { message: 'Upload complete' });
      
        res.send({
          message: "Video flipped and uploaded successfully",
          url: result.url.split("?")[0],
        });
      })
      .catch((error) => {
        sendErrors(error, res)
      });
  });
}

async function uploadToAzure(file, filename, io, containerName) {
  const containerClientForTutorVideos = blobServiceClient.getContainerClient(
    AZURE_CONT_BLOB_CODES[containerName]
  );

  const blobClient = containerClientForTutorVideos.getBlockBlobClient(
    filename
  );
  // await blobClient.uploadStream(file, undefined, undefined, {
  //   onProgress: (progress) => {
  //     io.emit("uploadProgress", {
  //       progress: Math.round((progress.loadedBytes / fileSize) * 100),
  //     });
  //   },
  // });

  const filePath = file.filepath; // Assuming `file` has a `filepath` attribute from Formidable
  const fileSize = fs.statSync(filePath).size;

  const uploadStream = fs.createReadStream(filePath);
  const progressStream = new PassThrough();

  // WebSocket or Socket.IO can be used here to send progress updates
  // Assuming `socket` is the connected socket from the frontend

  let uploadedBytes = 0;
  progressStream.on("data", (chunk) => {
    uploadedBytes += chunk.length;
    const progress = Math.round((uploadedBytes / fileSize) * 100);
    io.emit("uploadProgress", { progress });
  });

  // Pipe the upload through progressStream for tracking
  uploadStream.pipe(progressStream);

  // Upload to Azure with progress tracking
  await blobClient.uploadStream(progressStream, undefined, undefined, {
    onProgress: (progress) => {
      io.emit("uploadProgress", {
        progress: Math.round((progress.loadedBytes / fileSize) * 100),
      });
    },
  });

  return blobClient

}



const getVideo = async (req, res) => {
  try {
    const { user_id } = req.query;
    const blobClient = containerClientForTutorVideos.getBlockBlobClient(
      `${user_id}.mp4`
    );
    res.status(200).send({ url: blobClient.url });
  } catch (err) {
    sendErrors(err, res);
  }
};

module.exports = {
  getVideo,
  recordVideoController,
  uploadImageController,
  uploadTutorDocs,
  uploadVideoWOExec
};
