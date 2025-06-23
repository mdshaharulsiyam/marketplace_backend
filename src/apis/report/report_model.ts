

import { model, Schema } from "mongoose";
import { IReport } from "./report_types";

const report_schema = new Schema<IReport>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "auth",
    required: [true, "User is required"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: [true, "Product is required"],
  },
  reason: {
    type: String,
    required: [true, "Reason is required"],
  },
  status: {
    type: String,
    enum: ["OPEN", "RESOLVED", "CLOSED"],
    default: "OPEN",
  },
}, { timestamps: true });

export const report_model = model<IReport>("report", report_schema);


