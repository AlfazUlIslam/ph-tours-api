import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-") // Replace empty spaces with dashes
                .replace(/\./g, "-") // Replace dots with dashes
                .replace(/[^a-z0-9\-\.]/g, "") // Remove non alpha-numeric characters

            const extension = file.originalname.split(".").pop();

            const uniqueFileName = Math.random().toString(36)
                + "-" + Date.now() 
                + "-" + fileName 
                + "." + extension;

            return uniqueFileName;
        }
    }
});

export const multerUpload = multer({ storage });