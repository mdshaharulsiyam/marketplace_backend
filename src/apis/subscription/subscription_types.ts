import { Document, Types } from "mongoose";

export interface ISubscription extends Document {
  subscription_id: Types.ObjectId;
  user: Types.ObjectId;
  expires_in: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
