import * as userRepository from '../repository/user.repository.js';
import {userNotExist} from "../errors.js";
import fs from 'node:fs';

export  async  function updateProfilePic (userId,file){
    const user = await userRepository.findUserById(userId)
    if(!user) throw userNotExist
    if(user.profilePicPath){
        fs.unlinkSync(user.profilePicPath)
    }
    await userRepository.updateUserByEmail(user.email,{profilePicPath:file.path})
}