import { Schema, model } from "mongoose";
import IShippingAddress from "./shipping_address_type";

const shipping_address_schema = new Schema<IShippingAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    address: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        default: [0, 0],
        validate: {
          validator: function (value: number[]) {
            return value.length === 2;
          },
          message:
            "Coordinates must contain exactly two values: [longitude, latitude]",
        },
      },
    },
  },
  { timestamps: true },
);
shipping_address_schema.index({ location: "2dsphere" });

export const shipping_address_model = model<IShippingAddress>(
  "shipping_address",
  shipping_address_schema,
);
