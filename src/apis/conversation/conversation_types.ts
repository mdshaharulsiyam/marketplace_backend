import { Document, Types } from "mongoose";

export interface IConversation extends Document {
  users: Types.ObjectId[];
  blockedBy: Types.ObjectId[];
}
