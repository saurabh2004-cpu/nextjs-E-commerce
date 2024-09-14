import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.models";

// Define the IProduct interface
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    productOwner: IUser['_id']; // Reference to the User model
    keywords: string[];
    isAvailable: boolean;
    averageRating: number; 
    totalReviews:number
    highlight:string
    ram:number,
    storage:number,
    color:string,
    battery:Number,
    displaySize:number,
    launchYear:number,
    hdTechnology:string,
    clotheSize:string,
    clotheColor:string,
}

// Create the Product schema
const ProductSchema: Schema<IProduct> = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    productOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    keywords: {
        type: [String],
        default: [],
        required: [true, "add at least one keyword"]
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    averageRating: {
        type: Number, 
        default: 0 
    },
    totalReviews:{
        type:Number,
        default:0
    },
    highlight:{
        type:String,
    },

    //for mobiles and tablets
    ram:{
        type:Number,
    },
    storage:{
        type:Number,
    },
    color:{
        type:String,
    },
    battery:{
        type:Number,
    },

    //for tv and appliences
    displaySize:{
        type:Number,
    },
    launchYear:{
        type:Number,
    },
    hdTechnology:{
        type:String,
    },

    //fashion
    clotheSize:{
        type:String,
    },
    clotheColor:{
        type:String,
    },

    //later add more 
    


}, { timestamps: true });

// Create and export the Product model
const ProductModel = mongoose.models.Product as mongoose.Model<IProduct> || mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
