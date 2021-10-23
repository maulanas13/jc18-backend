const multer = require("multer");
const fs = require("fs");

// Destination adalah tempat dimana kita mau menyimpan filenya
// filenamePrefix adalah nama depan dari filenya (bs aja org nyimpen file namanya sama)
// Kasih nama depan unique pake date, misal USER3213131317
const uploader = (destination, filenamePrefix) => {
    let defaultPath = "./public";
    console.log(defaultPath);
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            console.log("Line 12: ", file);
            const dir = defaultPath + destination;
            console.log("dir: ", dir);
            if (fs.existsSync(dir)) {
                console.log(dir, "exist");
                cb(null, dir);
            } else {
                fs.mkdir(dir, {recursive: true}, (err) => cb(err, dir));
                console.log(dir, "make");
            }
        },
        filename: (req, file, cb) => {
            let originalName = file.originalname;
            let ext = originalName.split(".");
            let filename = filenamePrefix + Date.now() + "." + ext[ext.length - 1];
            cb(null, filename);
        }
    });

    const imageFilter = (req, file, callback) => {
        const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx)$/; // regex
        if (!file.originalname.match(ext)) {
            return callback(new Error("Only selected file type are allowed"));
        } 
        callback(null, true)
    };

    return multer({
        storage: storage,
        fileFilter: imageFilter,
        limits: {
            fileSize: 2 * 1024 * 1024 // 1mb
        }
    })
}

module.exports = uploader;

// module.exports = multer({
//     storage: ,
//     limit: ,
// })