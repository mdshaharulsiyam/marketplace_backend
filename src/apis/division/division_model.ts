import { model, Schema } from "mongoose";
import { IDivision } from "./division_types";

const division_schema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: [true, "division name is required"],
      unique: true,
    },
  },
  { timestamps: true },
);

export const division_model = model<IDivision>("division", division_schema);
