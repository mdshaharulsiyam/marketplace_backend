import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from "../Auth/auth_types";
import { notification_model } from "./notification_model";
import { INotification } from "./notification_types";

async function create(data: INotification) {
  await notification_model.insertMany(data);
  return {
    success: true,
    message: "notification created successfully",
  };
}
async function get_all(
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
  populatePath?: any,
  selectFields?: string | string[],
  modelSelect?: string,
) {
  return await Queries(
    notification_model,
    queryKeys,
    searchKeys,
    populatePath,
    selectFields,
    modelSelect,
  );
}
async function read_notification(id: string, user: IAuth) {
  const result = await notification_model.findOneAndUpdate(
    { _id: id, user },
    {
      $set: {
        ...(user?.role != "ADMIN" && user?.role != "SUPER_ADMIN"
          ? { read_by_user: true }
          : { read_by_admin: true }),
      },
    },
  );
  return {
    success: true,
    message: "notification deleted successfully",
    data: result,
  };
}
async function delete_notification(query: any) {
  const result = await notification_model.deleteOne(query)
  if (result?.deletedCount > 0) {
    return {
      success: true,
      message: "notification deleted successfully"
    }
  }
  return {
    success: false,
    message: "unable to delete notification"
  }
}
export const notification_service = Object.freeze({
  create,
  get_all,
  read_notification,
  delete_notification
});
