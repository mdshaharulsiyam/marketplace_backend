import { model, Schema } from "mongoose";
import { ISubscription } from "./subscription_types";

const subscription_schema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "user id is required"],
      unique: true,
    },
    subscription_id: {
      type: Schema.Types.ObjectId,
      required: [true, "subscription id is required"],
    },
    expires_in: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const subscription_model = model<ISubscription>(
  "subscription",
  subscription_schema,
);
