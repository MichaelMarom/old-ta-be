const { v4: uuidv4 } = require("uuid");
const account = process.env.AZURE_ACCOUNT_NAME;
const { sendErrors } = require("../utils/handleReqErrors");

const formidable = require("formidable");
const fs = require("fs");
const { BlobServiceClient } = require("@azure/storage-blob");

const { path } = require("../modules");
const {
  deleteBlobsWithPrefix,
  deleteFolderContents,
  deleteBlobWithName,
} = require("../utils/generalHelperFunctions");
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
      url: `https://${account}.blob.core.windows.net/${
        AZURE_CONT_BLOB_CODES[req.body.container]
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
      const fileName = `${userId}-${fileType}-${new Date().getTime()}-${
        file.originalFilename
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

module.exports = { uploadImageController, uploadTutorDocs };
