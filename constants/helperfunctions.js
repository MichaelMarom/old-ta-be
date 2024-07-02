const { fs, path } = require("../modules");
const fsPromises = fs.promises;

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const deleteFolderContents = (folderPath) => {
    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
        console.error("Folder does not exist");
        return;
    }

    // Get all files and subdirectories within the folder
    const files = fs.readdirSync(folderPath);
    console.log('deleting folders')

    // Iterate through each file/directory and delete it
    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        // Check if it's a file or a directory
        const isDirectory = fs.lstatSync(filePath).isDirectory();

        if (isDirectory) {
            // If it's a directory, recursively call deleteFolderContents
            deleteFolderContents(filePath);
            // After deleting all contents, remove the directory itself
            fs.rmdirSync(filePath);
        } else {
            // If it's a file, simply delete it
            fs.unlinkSync(filePath);
        }
    });
}

const deleteFolder = async (folderPath) => {
    try {
        console.log(folderPath + ' deleted')
      const files = await fsPromises.readdir(folderPath);
      await Promise.all(files.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const stat = await fsPromises.stat(filePath);
  
        if (stat.isDirectory()) {
          await deleteFolder(filePath);
        } else {
          await fsPromises.unlink(filePath);
        }
      }));
      await fsPromises.rmdir(folderPath);
    } catch (err) {
      console.error(`Error while deleting ${folderPath}.`, err);
    }
  };

  const deleteBlobsWithPrefix = async (containerClient, prefix) => {
    for await (const blob of containerClient.listBlobsFlat({ prefix })) {
      const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
      await blockBlobClient.delete();
    }
  };
  
module.exports = {
    deleteBlobsWithPrefix,
    capitalizeFirstLetter,
    deleteFolder,
    deleteFolderContents,
};