import mongoose, { Schema, Document } from 'mongoose';

interface IProductAnalytics extends Document {
    product: mongoose.Schema.Types.ObjectId;
    customer: mongoose.Schema.Types.ObjectId[];
    impressions: number;
    clicks: number;
    inWishlist: number;
    inCarts: number;
    orders: number;
    reviews: number;
    averagerRatings: number;
}

const ProductAnalyticsSchema: Schema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    customer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    clicks: {
        type: Number,
        default: 0
    },
    inWishlist: {
        type: Number,
        default: 0
    },
    inCarts: {
        type: Number,
        default: 0
    },
    orders: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    averageratings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const ProductAnalyticsmodel = mongoose.model<IProductAnalytics>('ProductAnalytics', ProductAnalyticsSchema);
