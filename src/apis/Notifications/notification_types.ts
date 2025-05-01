import { Types } from "mongoose";

export interface INotification {
  user: Types.ObjectId;
  message: string;
  title: string;
  read_by_admin: boolean;
  read_by_user: boolean;
}
