const AZURE_CONT_BLOB_CODES = {
    'tutor-profile-image': process.env.AZURE_BLOB_TUTOR_IMG_CONT_NAME,
    'student-profile-image': process.env.AZURE_BLOB_STUDENT_IMG_CONT_NAME,
    'tutor-intro-video': process.env.AZURE_BLOB_CONT_NAME,
    'tutor-docs': process.env.AZURE_BLOB_TUTOR_DOCS_CONT_NAME,

}


module.exports = {
    AZURE_CONT_BLOB_CODES
}