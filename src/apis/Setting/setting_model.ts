import { model, Schema } from "mongoose";
import { ISetting, IWebsiteSetting } from "./setting_type";

const setting_schema = new Schema<ISetting>(
  {
    name: {
      type: String,
      unique: true,
      enum: ["about", "terms", "privacy", "contact"],
    },
    desc: { type: String, trim: true, lowercase: true, required: true },
  },
  { timestamps: true },
);

export const setting_model = model("setting", setting_schema);

const website_setting_schema = new Schema<IWebsiteSetting>(
  {
    site_name: { type: String, required: true },
    logo: { type: String, required: true },
    favicon: { type: String },
    contact_email: { type: String, required: true },
    contact_phone: { type: String },
    address: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number] },
    },
    social_media: {
      facebook: { type: String, default: null },
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null },
    },
    appearance: {
      primary_color: { type: String, default: "#000000" },
      secondary_color: { type: String, default: "#FFFFFF" },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
    },
    seo: {
      meta_title: { type: String },
      meta_description: { type: String },
      meta_keywords: { type: [String] },
    },
    currency: {
      symbol: { type: String, default: "TK" },
      code: { type: String, default: "BDT" },
    },
    tax: {
      is_enabled: { type: Boolean, default: false },
      rate: { type: Number, default: 0 },
    },
    shipping: {
      free_shipping_threshold: { type: Number, default: 0 },
      standard_rate: { type: Number, default: 5 },
    },
    maintenance_mode: { type: Boolean, default: false },
    auto_approve_vendor: { type: Boolean, default: false },
    auto_approve_product: { type: Boolean, default: false },
    vendor_request: { type: Boolean, default: true },
    make_admin: { type: Boolean, default: true },
  },
  { timestamps: true },
);

website_setting_schema.index({ location: "2dsphere" });

export const WebsiteSettingModel = model<IWebsiteSetting>(
  "web_setting",
  website_setting_schema,
);
