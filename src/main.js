import {config} from 'dotenv';
config()
import './common/db/mongoose'
import express from 'express';
import authRouter from "./app/auth/auth.route";
import messageRouter from "./app/message/message.route";
import userRouter from "./app/user/user.route";
const app = express();


app.use(express.json());

app.use('/auth', authRouter);
app.use('/message', messageRouter);
app.use('/user', userRouter);


app.listen(3000,()=>{
    console.log('Server started on port 3000!');
})