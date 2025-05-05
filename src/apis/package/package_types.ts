import { Document } from "mongoose";

export interface IPackage extends Document {
  name: string;
  type: "MONTHLY" | "YEARLY";
  price: number;
  features: string[];
}
