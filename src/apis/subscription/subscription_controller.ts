import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { sendResponse } from "../../utils/sendResponse";
import { IAuth } from "../Auth/auth_types";
import { SearchKeys } from "./../../utils/Queries";
import { subscription_service } from "./subscription_service";

const create = async (req: Request, res: Response) => {
  const packages = req.extra?.packages
  const { _id } = req.user as IAuth
  const result = await subscription_service.create({ subscription_id: req.body?.subscription_id, user: _id }, packages, req);
  sendResponse(res, HttpStatus.CREATED, result);
};

const get_all = async (req: Request, res: Response) => {
  const { search, ...otherValues } = req?.query;
  const searchKeys: SearchKeys = {};

  if (search) searchKeys.name = search as string;

  const queryKeys = {
    ...otherValues,
  };

  const result = await subscription_service.get_all(queryKeys, searchKeys);

  sendResponse(res, HttpStatus.SUCCESS, result);

};
const get_my_subscription = async (req: Request, res: Response) => {
  const { _id } = req.user as IAuth
  const result = await subscription_service.get_my_subscription(_id?.toString() as string)
  sendResponse(res, HttpStatus.SUCCESS, result)
}
const update = async (req: Request, res: Response) => {
  const img =
    (!Array.isArray(req.files) &&
      req.files?.img &&
      req.files.img.length > 0 &&
      req.files.img[0]?.path) ||
    null;

  if (img) req.body.img = img;

  const result = await subscription_service.update(req?.params?.id, req?.body);
  sendResponse(res, HttpStatus.SUCCESS, result);
};

const delete_subscription = async (req: Request, res: Response) => {
  const result = await subscription_service.delete_subscription(
    req?.params?.id,
    req?.body,
    req?.user as IAuth,
  );
  sendResponse(res, HttpStatus.SUCCESS, result);
};

export const subscription_controller = {
  create,
  get_all,
  update,
  delete_subscription,
  get_my_subscription
};
