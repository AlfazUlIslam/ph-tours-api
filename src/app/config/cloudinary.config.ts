import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
    cloud_name: env.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY.CLOUDINARY_API_SECRET
});

export const cloudinaryUpload = cloudinary;

export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

        const match = url.match(regex);

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id);
            console.log(`File ${public_id} is  deleted from cloudinary`)
        };
    } catch (error: any) {
        throw new AppError(401, "Cloudinary image deletion failed", error.message);
    }
};