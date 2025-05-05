

import { model, Schema } from "mongoose";
import { IFavorite } from "./favorite_types";

const favorite_schema = new Schema<IFavorite>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'user is required'],
  },
  product: {
    type: Schema.Types.ObjectId,
    required: [true, 'product is required'],
  },

}, { timestamps: true });

export const favorite_model = model<IFavorite>("favorite", favorite_schema);


