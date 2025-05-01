import { Document, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  description: string;
  rating: number;
  issue: Types.ObjectId | null;
  business: Types.ObjectId;
  img: string[];
  review_for: "WEBSITE" | "SERVICE";
  is_approved: boolean;
}
