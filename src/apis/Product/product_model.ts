import { Schema, model } from "mongoose";
import IProduct from "./product_type";

const product_schema = new Schema<IProduct>(
  {
    name: { type: String, required: [true, "Product Name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    img: {
      type: [String],
      required: [true, "Product image is required"],
      validate: {
        validator: function (value: string[]) {
          return value.length <= 6;
        },
        message: "A maximum of 4 images are allowed.",
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category is required"],
    },
    sub_category: {
      type: Schema.Types.ObjectId,
      ref: "service",
      required: [true, "Sub category is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "auth",
      required: [true, "User is required"],
    },
    condition: {
      type: String,
      enum: ["USED", "NEW"],
      required: [true, "product condition is required"],
    },
    status: {
      type: String,
      enum: ["ARCHIVED", "ACTIVE", "SOLD", "PENDING", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export const product_model = model<IProduct>("product", product_schema);
