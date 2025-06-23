

import { Document, Types } from "mongoose";

export interface IReport extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  reason: string;
  status: "OPEN" | "RESOLVED" | "CLOSED";
}

