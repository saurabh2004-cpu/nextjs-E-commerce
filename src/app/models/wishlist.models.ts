import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistItem {
    product: mongoose.Schema.Types.ObjectId;
}

export interface IWishlist extends Document {
    user: mongoose.Schema.Types.ObjectId;
    items: IWishlistItem[];
}

const wishlistSchema: Schema<IWishlist> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
    }]
}, { timestamps: true });

const WishlistModel = mongoose.models.Wishlist as mongoose.Model<IWishlist> || mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default WishlistModel;
