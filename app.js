require("dotenv").config()


const {
    google
} = require("googleapis");
const path = require("path");
const fs = require("fs");
const {
    file
} = require("googleapis/build/src/apis/file");

const async = require('async');

/**
 * Watch the video on how to get CLIENT_ID, CLIENT_SECRET, REDIRECT_URI and REFRECH_TOKEN
 * https://www.youtube.com/watch?v=1y0-IfRW114&t=1242s
 */

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRECH_TOKEN = process.env.REFRECH_TOKEN

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: REFRECH_TOKEN
});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

// function that Upload a file to a G-drive
/**
 * 
 * @param {String} fileName - The name of the file on Google Drive
 * @param {String} fileMimeType  - The Media type of the file (e.g. "image/png" or "application/pdf")
 * @param {String} filePath - The path to the file which is gonne to be uploaded to google drive.
 * @param {String} parentFolderID - The ID of the parent folder on google drive, Use 'root' in case you want to put it in the root of the drive
 * @async 
 */
async function uploadFile(fileName, fileMimeType, filePath, parentFolderID) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: fileMimeType,
                parents: [parentFolderID]
            },
            media: {
                mimeType: fileMimeType,
                body: fs.createReadStream(filePath)
            }
        })
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}


/**
 * This functions deletes a file/folder from google drive by providing its ID.
 * @async 
 * @param {String} fileID - The ID of the file on google drive
 */
async function deleteFile(fileID) {
    try {
        const response = await drive.files.delete({
            fileId: fileID,
        });

        console.log(response.data, response.status);

    } catch (error) {
        console.log(error.message);
    }

}


/**
 * CreateFolderOnGdrive creates a folder in google drive
 * @async : Asynchronous function
 * @param {String} folderName - The name of the folder
 * @param {String} parentFolderID - the google's id of the parent folder. 'root' by default.
 */
async function createFolderOnGDrive(folderName, parentFolderID) {
    let folderId=undefined; 

    var fileMetadata = {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [parentFolderID]
    };
    let response = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id'
    }).then(function (response) {
            //Handle the results here(response.result has the parsed body).
            console.log("Folder Id", response.data.id);
            folderId = response.data.id ;
        },
        function (err) {
            // handle error here.
            console.error("Execute error", err);
            throw(err)
        });
        return (folderId)
}


/**
 * folderExists function checks if a folder exists on google drive 
 * and returns its ID.
 * @param {String} folderName - The name of the folder
 * @param {String} ParentFolderId - The Id of the parent folder
 * @returns The id of the folder on google drive
 */

async function folderExists(folderName, ParentFolderId) {
    var idfound=undefined;

    const response = await drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.folder' and name='"+folderName+"'",
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }).then((response)=>{
        const files = response.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {

                console.log(`${file.name} (${file.id})`);
                if (file.name ===folderName) 
                {
                    idfound =file.id;
                    console.log(folderName + " exists !!!!!");
                }
            });
        }
    }).catch((err)=>{
       console.log('The API returned an error: ' + err);
       throw (err)
    });
    return idfound ;
}

/**
 * fileExists function checks if a folder exists on google drive 
 * and returns its ID.
 * @param {String} fileName - The name of the folder
 * @param {String} ParentFolderId - The Id of the parent folder
 */

async function fileExists(fileName, ParentFolderId) {
    var idfound=undefined;

    const response = await drive.files.list({
        q: "name='"+fileName+"'",
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }).then((response)=>{
        const files = response.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {

                console.log(`${file.name} (${file.id})`);
                if (file.name ===fileName) 
                {
                    idfound =file.id;
                    console.log(fileName + " exists !!!!!");
                }
            });
        }
    }).catch((err)=>{
       console.log('The API returned an error: ' + err);
       throw (err)
    });
    return idfound ;
}



/* tests and examples */   
// const filePath = path.join(__dirname, 'FACTURE.pdf');

// const ffName = 'facture Telephone.pdf';
// const ffMimeType = "application/pdf";
// const ffpath = filePath;
// const fparentFolderID = ''

/* Upload file */ 
//uploadFile(ffName,ffMimeType,ffpath)

/* Delete File*/
// const fileToDel = '1-uMZVMiZX_Zkr_cf0jKtfw1hfxc03E62ozK-u9Ep04o'
// deleteFile(fileToDel);

// createFolderOnGDrive("Carnet des doctorants",'root').then(fId =>{
//     console.log('Folder Created successfully with the Id :'+ fId);
//     // Do somethin else with the folderID.
// });

// folderExists('tibermacine', '').then((x)=>{
//     console.log("Final result File ID : "+ x);
// })


// fileExists("Tutorial",'').then((x)=>{
//     console.log(" File found by ID : "+ x);
// })


exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;
exports.createFolderOnGDrive = createFolderOnGDrive;
exports.folderExists= folderExists;
exports.fileExists= fileExists;
