import multer, {diskStorage} from "multer"
import crypto from "node:crypto";
import {AppError} from "../error/error.js";
import {allowedFields} from "./file.validation.js";
function multerUpload(allowedTypes = allowedFields.images){
    return multer({
        fileFilter: (req, file, cb) => {
            if(!allowedTypes.includes(file.mimetype)){
                return cb(new AppError('invalid file format',400),false)
            }
                cb('null',true)
        },
        storage: diskStorage({
            destination:'uploads', filename:function (req, file, cb) {
                console.log(file)
                cb(null, `${crypto.randomUUID()}-${file.originalname}`)
            }
        })
    })
}

export function uploadSingleFile(fileName,allowedTypes=allowedFields.images){
    return multerUpload(allowedTypes).single(fileName)
}

export function uploadMultipleFiles(fieldNames,maxCount){
    return multerUpload().array(fieldNames,maxCount)
}

export function uploadFields(fields){
    return multerUpload().fields(fields)
}
