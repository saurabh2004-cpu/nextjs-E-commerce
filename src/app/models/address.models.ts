import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.models'; 


export interface IAddress extends Document {
  user: mongoose.Schema.Types.ObjectId;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const AddressSchema: Schema<IAddress> = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
}, { timestamps: true });

const AddressModel = mongoose.models.Address as mongoose.Model<IAddress> || mongoose.model<IAddress>('Address', AddressSchema);

export default AddressModel;
