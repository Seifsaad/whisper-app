import multer, {diskStorage} from "multer"
import crypto from "node:crypto";
function multerUpload(){
    return multer({
        storage: diskStorage({
            destination:'uploads', filename:function (req, file, cb) {
                console.log(file)
                cb(null, `${crypto.randomUUID()}-${file.originalname}`)
            }
        })
    })
}

export function uploadSingleFile(fileName){
    return multerUpload().single(fileName)
}

export function uploadMultipleFiles(fieldNames,maxCount){
    return multerUpload().array(fieldNames,maxCount)
}

export function uploadFields(fields){
    return multerUpload().fields(fields)
}
