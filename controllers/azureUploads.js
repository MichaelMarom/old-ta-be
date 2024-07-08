const { v4: uuidv4 } = require('uuid');
const account = process.env.AZURE_ACCOUNT_NAME;
const { BlobServiceClient } = require("@azure/storage-blob");

const { path } = require('../modules');
const { deleteBlobsWithPrefix, deleteFolderContents } = require('../constants/helperfunctions');
const { AZURE_CONT_BLOB_CODES } = require('../constants/common');

const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net/?${process.env.AZURE_BLOB_SAS_TOKEN}`
);

const uploadImageController = async (req, res) => {
    try {
        console.log(AZURE_CONT_BLOB_CODES)
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
        console.log(filePath)

        await blockBlobClient.uploadFile(filePath);
        const folderPath = path.join(__dirname, '../profileImgs');
        deleteFolderContents(folderPath);
        res.status(200).send({
            message: "Image uploaded successfully",
            url: `https://${account}.blob.core.windows.net/${AZURE_CONT_BLOB_CODES[req.body.container]}/${blobName}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to upload the image", reason: err.message });
    }
};


module.exports = { uploadImageController };