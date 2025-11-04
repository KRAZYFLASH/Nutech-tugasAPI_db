import multer from 'multer'

// Penggunaan memory cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Export function unutk upload file
const uploadFile = upload.single('file'); 

export default uploadFile