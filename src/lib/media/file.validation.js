import { fileTypeFromBuffer } from "file-type";
import fs from "node:fs";
import {AppError} from "../error/error.js";

export const allowedFields = {
    images:["image/png","image/jpeg","image/gif"],
    files: ['application/pdf','application/msword'],
    videos: ['video/mp4'],
    audio: ['audio/mp3'],
}

// Middleware to validate file type by magic number (file signatures)
export const fileValidation =(allowedTypes = allowedFields.images)=>
    async (req, res, next) => {
    try {
        // get the file path
        const filePath = req.file.path;
        // read the file and return buffer
        const buffer = fs.readFileSync(filePath);
        // get the file type
        const type = await fileTypeFromBuffer(buffer);
        // validate
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!type || !allowedTypes.includes(type.mime))
            return next(new AppError("Invalid file type",400));

        return next();
    } catch (error) {
        return next(new Error("Internal server error"));
    }
};