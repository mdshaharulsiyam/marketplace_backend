import { model, Schema } from "mongoose";
import { ISubscription } from "./subscription_types";

const subscription_schema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "user id is required"],
      ref: "auth",
      unique: true,
    },
    subscription_id: {
      type: Schema.Types.ObjectId,
      required: [true, "subscription id is required"],
      ref: "package"
    },
    expires_in: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true },
);

export const subscription_model = model<ISubscription>(
  "subscription",
  subscription_schema,
);
