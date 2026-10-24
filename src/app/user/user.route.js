import {Router} from 'express';
import {withCache} from "../../lib/cache/withCache.js";
import {User} from "./model/user.model.js";
import {uploadMultipleFiles, uploadSingleFile} from "../../lib/media/multer.js";
import {allowedFields, fileValidation} from "../../lib/media/file.validation.js";
import * as userController from "./controller/user.controller.js";
import {authGuard} from "../../lib/auth/authGuard.js";

const userRouter = Router();

userRouter.get('/get-all-users',
    withCache(),
    async (req, res, next) => {
        const users = await User.find();
        res.json(users);
    })


userRouter.post('/upload-profile-pic',authGuard,uploadSingleFile('pp'),
    fileValidation(),
    userController.updateProfilePic
)

userRouter.post('/upload-cv',uploadSingleFile('cv',allowedFields.files),
    fileValidation(allowedFields.files),
    (req,res,next)=>{
    console.log(req.file);
    res.json('ok')
})

userRouter.post('/upload-cover-images',uploadMultipleFiles('cover-images',3),(req,res,next)=>{
    console.log(req.files);
    res.json('ok')
})



export default userRouter;