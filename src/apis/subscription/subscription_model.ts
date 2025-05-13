import { model, Schema } from "mongoose";
import cron from "node-cron";
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
      ref: "package",
    },
    expires_in: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const subscription_model = model<ISubscription>(
  "subscription",
  subscription_schema,
);

cron.schedule("0 2 * * *", async () => {
  try {
    await subscription_model.updateMany(
      { expires_in: { $lt: new Date() }, active: true }, // Find expired subscriptions
      { $set: { active: false } },
    );
  } catch (error) {
    console.error("Error updating expired subscriptions:", error);
  }
});
