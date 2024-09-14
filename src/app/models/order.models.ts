import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.models"; 
import { IProduct } from "./product.models"; 

export interface IOrderItem {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
}

export interface IOrder extends Document {
    user: mongoose.Schema.Types.ObjectId;
    items: IOrderItem[];
    total: number;
    status: 'pending' | 'shipped' | 'delivered';
}

const OrderSchema: Schema<IOrder> = new Schema({
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
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    }
}, { timestamps: true });

const OrderModel = (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
