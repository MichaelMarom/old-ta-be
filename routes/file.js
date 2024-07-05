const express = require('express');
const { upload:multerUpload, handleFileDeletion } = require('../files');
const { uploadImageController } = require('../controllers/azureUploads');
const FILE_ROUTER = express.Router();
const multer = require('multer')
const upload = multer({dest: 'tutorImgs/'})

const handleFileUpload = (req, res) => {
    const filePath = req.file.path;
    res.json({ filePath });
};


// Route for /upload
FILE_ROUTER.post('/upload', multerUpload.single('file'), handleFileUpload);
FILE_ROUTER.post('/upload-image-azure/:tutorId', upload.single('file'), uploadImageController);
FILE_ROUTER.delete('/delete-file/:id', handleFileDeletion);

module.exports = FILE_ROUTER;

