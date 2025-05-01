import { Schema, model } from "mongoose";
import IProduct from "./product_type";

const product_schema = new Schema<IProduct>(
  {
    name: { type: String, required: [true, "Product Name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    discount: { type: Number, required: false },
    coupon: {
      available: { type: Boolean, default: false },
      coupon_code: {
        type: String,
        default: "",
        required: function (this: { coupon: { available: boolean } }) {
          return this.coupon.available;
        },
        validate: {
          validator: function (
            this: { coupon: { available: boolean } },
            value: string,
          ) {
            return this.coupon.available ? !!value : true;
          },
          message: "Coupon code is required if coupon is available.",
        },
      },
    },
    img: {
      type: [String],
      required: [true, "Product image is required"],
      validate: {
        validator: function (value: string[]) {
          return value.length <= 4;
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
      ref: "subCategory",
      required: [true, "Subcategory is required"],
    },
    is_approved: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
    stock: { type: Number, required: [true, "Stock is required"] },
    size: { type: [String], required: false },
    color: { type: [String], required: false },
    gender: { type: String, required: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: "auth",
      required: [true, "User is required"],
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "business",
      required: [true, "Business is required"],
    },
  },
  { timestamps: true },
);

export const product_model = model<IProduct>("product", product_schema);
