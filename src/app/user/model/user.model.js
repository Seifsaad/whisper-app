import {Schema,model} from "mongoose";

const UserSchema = new Schema({
        name: {type: String, required: true, minlength: 3, maxlength: 20, trim: true},
        email: {type: String, required: true, unique: true, lowercase: true, trim: true},
        password: {
            type: String, required: function () {
                return this.provider === 'local';
            }
        },
        provider: {type: String, enum: ['local', 'google', 'facebook'], default: "local"},
        isDeleted: {type: Boolean, default: false},
        isVerified: {type: Boolean, default: false},
        dob: Date,
        gender: {type: String, enum: ['male', 'female'], default: "male"}
    },
    {timestamps: {createdAt: true, updatedAt: true}});

export const User = model('User', UserSchema);