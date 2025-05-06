import { Document, Types } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  img: string[];
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  condition: string;
  status: string;
  user: Types.ObjectId;
  city: Types.ObjectId
  createdAt?: Date;
  updatedAt?: Date;
}

export default IProduct;
