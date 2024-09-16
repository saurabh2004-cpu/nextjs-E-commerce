import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.models"; 
import { IProduct } from "./product.models"; 

export interface ICartItem {
  product: mongoose.Types.ObjectId; // Use mongoose.Schema.Types.ObjectId here
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId; // Use mongoose.Schema.Types.ObjectId here
  items: ICartItem[];
}

const CartSchema: Schema<ICart> = new Schema({
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
  }]
}, { timestamps: true });

const CartModel = (mongoose.models.Cart as mongoose.Model<ICart>) || mongoose.model<ICart>("Cart", CartSchema);

export default CartModel;
