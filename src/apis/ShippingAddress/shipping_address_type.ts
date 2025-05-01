import { Document, Types } from "mongoose";

interface IShippingAddress extends Document {
  user: Types.ObjectId;
  address: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export default IShippingAddress;
