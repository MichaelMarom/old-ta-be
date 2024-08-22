const { v4: uuidv4 } = require("uuid");
const account = process.env.AZURE_ACCOUNT_NAME;

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
    console.log(filePath);

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
    res
      .status(500)
      .send({ message: "Failed to upload the image", reason: err.message });
  }
};

const uploadTutorDocs = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const containerClient = blobServiceClient.getContainerClient(
        AZURE_CONT_BLOB_CODES[fields.container[0]]
      );
      const blockBlobClient = containerClient.getBlockBlobClient(
        `${fields.userId[0]}-${new Date().getTime()}.${path.extname(
          file[0].originalFilename
        )}`
      );

      await deleteBlobWithName(containerClient, fields.existingFileName?.[0]);
      
      const fileStream = fs.createReadStream(file[0].filepath);
      await blockBlobClient.uploadStream(fileStream);

      return res.status(200).json({
        message: "File uploaded successfully",
        filename: `${fields.userId[0]}-${new Date().getTime()}${path.extname(
          file[0].originalFilename
        )}`,
      });
    } catch (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: "Failed to upload file to Azure" });
    }
  });
};

module.exports = { uploadImageController, uploadTutorDocs };
