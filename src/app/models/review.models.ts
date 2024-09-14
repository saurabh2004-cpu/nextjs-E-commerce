import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './user.models'; 
// import { IProduct } from './product.models'; 

export interface IReview extends Document {
    user: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
}

const ReviewSchema: Schema<IReview> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ReviewModel = mongoose.models.Review as mongoose.Model<IReview> || mongoose.model<IReview>("Review", ReviewSchema);

export default ReviewModel;
