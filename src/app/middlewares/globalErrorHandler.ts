import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError, handleCastError, handleValidationError, handleZodError } from "../helpers";
import { IErrorSources } from "../interfaces/error.types";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (env.NODE_ENV === "development") {
       console.log(err); 
    };

    try {
        if (req.file) {
            await deleteImageFromCloudinary(req.file.path);
        };

        if (req.files && req.files.length) {
            const imageUrls = (req.files as Express.Multer.File[]).map(
                (file) => file.path
            );

            await Promise.all(imageUrls.map(
                (imageUrl) => deleteImageFromCloudinary(imageUrl)
            ));
        };    
    } catch (cleanupError) {
         console.error("Failed to clean up Cloudinary images:", cleanupError);
    }

    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources: IErrorSources[] = [];

    // Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } 
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } 
    // Zod error
    else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as IErrorSources[];
    } 
    // Mongoose validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as IErrorSources[];
    } 
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } 
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    };

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: env.NODE_ENV === "development" ? err : null,
        stack: env.NODE_ENV === "development" ? err.stack : null
    });
}

export default globalErrorHandler;