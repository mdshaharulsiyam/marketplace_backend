import { Document, Types } from "mongoose";

interface IProduct extends Document {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  description: string;
  city: Types.ObjectId;
  division: Types.ObjectId;
  img: string[];
  status: string;
  user: Types.ObjectId;
  order_range: [number, number];
  condition: "NEW" | "USED";
  createdAt?: Date;
  updatedAt?: Date;
}

export default IProduct;
