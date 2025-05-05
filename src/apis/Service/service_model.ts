import { model, Schema } from "mongoose";
import { IService } from "./service_type";

const service_schema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "category is required"],
    },
  },
  { timestamps: true },
);

export const service_model = model<IService>("service", service_schema);
