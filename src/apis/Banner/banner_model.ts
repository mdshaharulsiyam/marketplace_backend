import { Schema, model } from "mongoose";
import { IBanner } from "./banner_type";

const banner_schema = new Schema<IBanner>(
  {
    img: {
      type: String,
      required: [true, "Banner image URL is required"],
    },
    link: {
      type: String,
      required: false,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    start_date: {
      type: Date,
      required: false,
    },
    emoji: {
      type: String,
      required: false,
    },
    end_date: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

export const banner_model = model<IBanner>("banner", banner_schema);
