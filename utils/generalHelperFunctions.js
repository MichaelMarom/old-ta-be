const moment = require("moment-timezone");
const _ = require("lodash")

const { fs, path, shortId } = require("../modules");
const COMMISSION_DATA = require("../constants/tutor");
const fsPromises = fs.promises;

function checkSessionStatus(session, timezone) {
  const currentTime = moment().tz(timezone);

  const sessionStart = moment(session.start).tz(timezone);
  const sessionEnd = moment(session.end).tz(timezone);

  if (currentTime.isBetween(sessionStart, sessionEnd, undefined, "[]")) {
    return "current";
  } else if (currentTime.isBefore(sessionStart)) {
    return "future";
  } else if (currentTime.isAfter(sessionEnd)) {
    return "past";
  }
}

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const deleteFolderContents = (folderPath) => {
  // Ensure the folder exists
  if (!fs.existsSync(folderPath)) {
    console.error("Folder does not exist");
    return;
  }

  // Get all files and subdirectories within the folder
  const files = fs.readdirSync(folderPath);
  console.log("deleting folders");

  // Iterate through each file/directory and delete it
  files.forEach((file) => {
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
};

const deleteFolder = async (folderPath) => {
  try {
    console.log(folderPath + " deleted");
    const files = await fsPromises.readdir(folderPath);
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const stat = await fsPromises.stat(filePath);

        if (stat.isDirectory()) {
          await deleteFolder(filePath);
        } else {
          await fsPromises.unlink(filePath);
        }
      })
    );
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

/**
 * Convert an image file to a Base64-encoded string synchronously
 * @param {string} filePath - The path to the image file
 * @returns {string} - The Base64-encoded string of the image
 */
function imageToBase64Sync(filePath) {
  const data = fs.readFileSync(filePath);
  // Convert the binary data to a Base64-encoded string
  const base64Image = data.toString("base64");
  return base64Image;
}

const commissionAccordingtoNumOfSession = (sessionNumber) => {
  const commissionEntry = COMMISSION_DATA.find((entry) => {
    if (entry.max) {
      //if session number from start of sessions is less than entry.max and
      // greater than entry.min, then get percentage commision
      return sessionNumber >= entry.min && sessionNumber <= entry.max;
    } else {
      return sessionNumber >= entry.min;
    }
  });
  return commissionEntry ? commissionEntry.percent : null;
};

const calcNet = (rate, comm) => {
  const commissionAmount = (rate * comm) / 100;
  const netAmount = rate - commissionAmount;
  return netAmount;
};

const generateAcademyId = (fname, lname, mname = null) => {
  let academyId =  mname?.length > 0
    ? `${fname}${mname[0]}${lname[0]}${shortId.generate()}`
    : `${fname}${lname[0]}${shortId.generate()}`;

    return _.toLower(academyId)
};
const generateScreenName = (fname, lname, mname = null) => {
  return mname?.length > 0
    ? `${capitalizeFirstLetter(fname)} ${capitalizeFirstLetter(
        mname[0]
      )}. ${capitalizeFirstLetter(lname[0])}`
    : `${capitalizeFirstLetter(fname)}. ${capitalizeFirstLetter(lname[0])}`;
};

module.exports = {
  deleteBlobsWithPrefix,
  generateAcademyId,
  commissionAccordingtoNumOfSession,
  calcNet,
  generateScreenName,
  capitalizeFirstLetter,
  imageToBase64Sync,
  deleteFolder,
  deleteFolderContents,
  checkSessionStatus,
};
