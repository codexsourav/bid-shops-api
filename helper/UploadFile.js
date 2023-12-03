import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './static/uploads');
    },
    filename: function (req, file, cb) {
        const allowExt = ['jpg', 'png', 'jpeg', 'webp'];
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
        const fileExtension = file.originalname.split('.').pop();
        if (!allowExt.includes(fileExtension.toLowerCase())) {
            return cb(new Error('Invalid File format Not allowed! .' + fileExtension.toLowerCase() + " File",),);
        }
        const uniqueFileName = `${timestamp}_${randomString}.${fileExtension}`;
        return cb(null, uniqueFileName);
    }
})
export default multer({ storage: storage });

