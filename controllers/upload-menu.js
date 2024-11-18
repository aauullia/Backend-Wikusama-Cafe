const multer = require('multer');
const path = require('path');

// Konfigurasi storage multer
const configStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './Gambar'); // Pastikan folder ini ada
    },
    filename: (req, file, callback) => {
        /** Format: image-timestamp-originalname.jpg */
        callback(null, `image-${Date.now()}-${file.originalname}`);
    }
});

/** Definisikan fungsi upload */
const upload = multer({
    storage: configStorage,
    /** File filter untuk memeriksa tipe dan ukuran file */
    fileFilter: (req, file, callback) => {
        const allowedExtensions = ['image/jpg', 'image/png', 'image/jpeg'];

        // Memeriksa tipe file
        if (!allowedExtensions.includes(file.mimetype)) {
            return callback(new Error('Invalid type of file'), false); // Berikan error jika tipe file salah
        }

        // Memeriksa ukuran file
        const maxSize = 1 * 1024 * 1024; // Maksimum ukuran file adalah 1MB
        if (file.size > maxSize) {
            return callback(new Error('File size is over limit'), false); // Berikan error jika ukuran file terlalu besar
        }

        callback(null, true);
    }
});

module.exports = upload;
