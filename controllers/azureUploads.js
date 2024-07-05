const { v4: uuidv4 } = require('uuid');
const account = process.env.AZURE_ACCOUNT_NAME;
const streamifier = require('streamifier');
const { BlobServiceClient } = require("@azure/storage-blob");
const sql = require('mssql');
const { path } = require('../modules');
const { deleteFolder, deleteBlobsWithPrefix, deleteFolderContents } = require('../constants/helperfunctions');
const { marom_db } = require('../db');
const { insert, update } = require('../helperfunctions/crud_queries');
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net/?${process.env.AZURE_BLOB_SAS_TOKEN}`
);
const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_BLOB_TUTOR_IMG_CONT_NAME
);

const uploadImageController = async (req, res) => {
    try {
        const { tutorId } = req.params;
        if (!req.file || !req.file.mimetype.startsWith("image/")) {
            return res.status(400).send({ message: "Please upload an image file" });
        }

        if (!tutorId) {
            return res.status(400).send({ message: "Please provide a tutor id" });
        }

        //delete previous tutor image/ to replace with new one
        await deleteBlobsWithPrefix(containerClient, tutorId);

        const blobName = `${tutorId}-${uuidv4()}-${req.file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const filePath = path.join(__dirname, `../${req.file.path}`);
        console.log(filePath)

        await blockBlobClient.uploadFile(filePath);
        const folderPath = path.join(__dirname, '../tutorImgs');
        deleteFolderContents(folderPath);
        res.status(200).send({ message: "Image uploaded successfully", url: `https://${account}.blob.core.windows.net/${process.env.AZURE_BLOB_TUTOR_IMG_CONT_NAME}/${blobName}`});
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to upload the image", reason: err.message });
    }
};

module.exports = { uploadImageController };