import {model, Schema} from "mongoose";
import * as schema from "mongoose/types/types.d.ts";

const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200,
    },
    receiver:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    isDeleted:{
        type: Boolean,
        default: false
    },

},{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
})

export const Message = model("Message", messageSchema);