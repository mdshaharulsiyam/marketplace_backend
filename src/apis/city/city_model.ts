

import { model, Schema } from "mongoose";
import { ICity } from "./city_types";

const city_schema = new Schema<ICity>({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
  division: {
    type: Schema.Types.ObjectId,
    required: [true, 'division id is required'],
    ref: "division"
  }
}, { timestamps: true });

export const city_model = model<ICity>("city", city_schema);


