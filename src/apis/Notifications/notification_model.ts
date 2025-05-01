import { model, Schema } from "mongoose";
import { INotification } from "./notification_types";

const notification_schema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "auth",
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    read_by_admin: {
      type: Boolean,
      default: false,
    },
    read_by_user: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const notification_model = model<INotification>(
  "notification",
  notification_schema,
);
