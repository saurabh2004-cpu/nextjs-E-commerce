import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./product.models";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    fullname: string;
    phone: string;
    email: string;
    gender:string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    wishlist: mongoose.Types.ObjectId[]; 
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    fullname: {
        type: String,
        required: [true, "Full name is required"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true
    },
    email: {
        type: String,
        // required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    gender:{
        type: String,
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    
    
}, { timestamps: true });

const UserModel = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
