
const {uploadFile, deleteFile, createFolderOnGDrive } = require("./app")

const ffName= 'facture Telephone.pdf';
const ffMimeType ="application/pdf";
const ffpath = filePath;
const fparentFolderID =''

uploadFile(ffName,ffMimeType,ffpath)
