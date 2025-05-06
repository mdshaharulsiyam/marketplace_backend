import { model, Schema } from "mongoose";
import { currency_list_code } from "../../utils/stripe/stripe_currency";
import { IPayment } from "./payment_type";

const payment_schema = new Schema<IPayment>(
  {
    purpose: {
      type: String,
      required: [true, "purpose is required"],
      default: "subscription",
      enum: ["subscription"],
    },
    session_id: {
      type: String,
      required: [true, "session id is required"],
    },
    transaction_id: {
      type: String,
      default: null,
      required() {
        return this.status === true;
      },
    },
    status: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "auth",
      required: [true, "user id is required"],
    },
    pay_by: {
      type: String,
      required: [true, "pay by is required"],
      default: "CARD",
      enum: ["CARD"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      default: 0,
    },
    refund: {
      type: String,
      default: null,
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
      default: "USD",
      enum: currency_list_code,
    },
  },
  { timestamps: true },
);

export const payment_model = model<IPayment>("payment", payment_schema);
