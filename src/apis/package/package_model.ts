

import { model, Schema } from "mongoose";
import { IPackage } from "./package_types";

const package_schema = new Schema<IPackage>({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
  },
  type: {
    type: String,
    required: [true, 'type is required'],
    enum: ['MONTHLY', "YEARLY"],
    default: 'MONTHLY'
  },
  features: {
    type: [String],
    required: [true, 'features is required'],
    default: []
  }
}, { timestamps: true });

package_schema.pre("save", async function (next) {
  this.price = Number(this.price)
  next()
})


export const package_model = model<IPackage>("package", package_schema);


