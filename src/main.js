import'dotenv/config'
import './common/db/mongoose.js'
import express from 'express';
import authRouter from "./app/auth/auth.route.js";
import messageRouter from "./app/message/message.route.js";
import userRouter from "./app/user/user.route.js";
const app = express();


app.use(express.json());

app.use('/auth', authRouter);
app.use('/message', messageRouter);
app.use('/user', userRouter);


app.listen(3000,()=>{
    console.log('Server started on port 3000!');
})