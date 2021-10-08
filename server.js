const path = require("path")
const {uploadFile, deleteFile, createFolderOnGDrive } = require("./app")

/**
 * Example of creating a folder on google drive then upload a file on it
 */
createFolderOnGDrive("TestDirectory",'root').then(FolderID=>{
    console.log('Test --- Folder Id =' + FolderID);
    //  upload the sample.pdf file into the created folder
    uploadFile("SampleG.pdf","application/pdf",path.join(__dirname, 'sample.pdf'),FolderID).then(fid=>{
        console.log('File uploaded with id :' + fid);
    })

});

