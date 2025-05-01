import { Document, Types } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discount?: number;
  coupon?: {
    available: boolean;
    coupon_code?: string;
  };
  img: string[];
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  is_approved?: boolean;
  is_featured?: boolean;
  stock: number;
  total_sold?: number;
  size?: string[];
  color?: string[];
  gender?: string;
  rating?: number;
  total_rated?: number;
  user: Types.ObjectId;
  business: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

export default IProduct;
