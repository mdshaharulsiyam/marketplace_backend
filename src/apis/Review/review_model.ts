import { model, Schema } from "mongoose";
import { IReview } from "./review_type";

const review_schema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "auth",
      required: [true, "user id is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
    },
    issue: {
      type: Schema.Types.ObjectId,
      ref: "issue",
      required: function (this: IReview) {
        return this.review_for === "SERVICE";
      },
      validate: [
        {
          validator: function (this: IReview) {
            return this.issue !== null;
          },
          message: "issue id is required",
        },
      ],
      default: null,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "business",
      required: function (this: IReview) {
        return this.review_for === "SERVICE";
      },
      validate: [
        {
          validator: function (this: IReview) {
            return this.business !== null;
          },
          message: "business id is required",
        },
      ],
      default: null,
    },
    img: {
      type: [String],
      default: [],
    },
    review_for: {
      type: String,
      enum: ["WEBSITE", "SERVICE"],
      default: "WEBSITE",
    },
    is_approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const review_model = model<IReview>("review", review_schema);
