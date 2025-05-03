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
  created_at?: Date;
  updated_at?: Date;
}

export default IProduct;
