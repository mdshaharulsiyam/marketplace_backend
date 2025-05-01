import { Document } from "mongoose";

export interface ISetting extends Document {
  name: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface IAppearance {
  primary_color: string;
  secondary_color: string;
  theme: "light" | "dark";
}

export interface ISEO {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export interface ICurrency {
  symbol: string;
  code: string;
}

export interface ITax {
  is_enabled: boolean;
  rate: number;
}

export interface IShipping {
  free_shipping_threshold: number;
  standard_rate: number;
}

export interface ILocation {
  type: "Point";
  coordinates: number[];
}

export interface IWebsiteSetting extends Document {
  site_name: string;
  logo: string;
  favicon?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  location?: ILocation;
  social_media?: ISocialMedia;
  appearance: IAppearance;
  seo?: ISEO;
  currency: ICurrency;
  tax: ITax;
  shipping: IShipping;
  maintenance_mode: boolean;
  auto_approve_vendor: boolean;
  auto_approve_product: boolean;
  vendor_request: boolean;
  make_admin: boolean;
}
