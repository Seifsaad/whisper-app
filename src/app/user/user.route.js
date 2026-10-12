import {Router} from 'express';
import {withCache} from "../../lib/cache/withCache.js";
import {User} from "./model/user.model.js";
import {uploadMultipleFiles, uploadSingleFile} from "../../lib/media/multer.js";

const userRouter = Router();

userRouter.get('/get-all-users',
    withCache(),
    async (req, res, next) => {
        const users = await User.find();
        res.json(users);
    })


userRouter.post('/upload-profile-pic',uploadSingleFile('pp'),(req,res,next)=>{
    console.log(req.file);
    res.json('ok')
})

userRouter.post('/upload-cover-images',uploadMultipleFiles('cover-images',3),(req,res,next)=>{
    console.log(req.files);
    res.json('ok')
})



export default userRouter;