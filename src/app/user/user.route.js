import {Router} from 'express';
import {withCache} from "../../lib/cache/withCache.js";
import {User} from "./model/user.model.js";

const userRouter = Router();

userRouter.get('/get-all-users',
    withCache(),
    async (req, res, next) => {
        const users = await User.find();
        res.json(users);
    })


export default userRouter;