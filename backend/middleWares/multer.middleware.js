const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { giveUserFromDb } = require("../services/giveUser");

// Define the temp directory relative to this script
const tempDir = path.join(__dirname, 'public', 'temp');

// Ensure the temp directory exists
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: async function (req, file, cb) {
        try {
            const user = await giveUserFromDb(req.cookies.userId);
            if (!user) {
                return cb(new Error('No user found'), false);
            }

            const nameOfFile = `${user._id}${path.extname(file.originalname)}`;
            const localFilePath = path.join(tempDir, nameOfFile);

            // Log the full file path for debugging

            // Check if the file exists and delete it if necessary
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            cb(null, nameOfFile);
        } catch (e) {
            console.error('Error in filename callback:', e);
            cb(e, false);
        }
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
