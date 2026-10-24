import * as userService from "../service/user.service.js";

export async function updateProfilePic(req, res,next) {
    try {
        await userService.updateProfilePic(req.user.id,req.file)
        res.json({message: "ProfilePic updated successfully.",success:true});
    }catch (error){
        next(error)
    }
}