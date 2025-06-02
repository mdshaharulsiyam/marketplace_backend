import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { UnlinkFiles } from "../../middleware/fileUploader";
import { QueryKeys } from "../../utils/Aggregator";
import { sendResponse } from "../../utils/sendResponse";
import { IAuth } from "../Auth/auth_types";
import { product_service } from "./product_service";

const create = async function (req: Request, res: Response) {
  req.body.user = req?.user?._id?.toString();

  const result = await product_service.create(req.body);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const get_all = async function (req: Request, res: Response) {
  const {
    search,
    status = "ACTIVE",
    price_min,
    price_max,
    ...other_fields
  } = req.query;

  let searchKeys = {} as { name: string };

  let queryKeys = { ...other_fields, status } as QueryKeys;
  if (!req.user) queryKeys.status = "ACTIVE";
  if (price_min && price_max)
    queryKeys.price = { $gte: Number(price_min), $lte: Number(price_max) };
  if (
    req.user?.role != "ADMIN" &&
    req.user?.role != "SUPER_ADMIN" &&
    status != "ACTIVE"
  )
    queryKeys.user = req.user?._id;

  if (search) searchKeys.name = search as string;
  const result = await product_service.get_all(
    queryKeys,
    searchKeys,
    req.user?._id as string,
  );
  sendResponse(res, HttpStatus.SUCCESS, result);
};
const admin_get_all = async function (req: Request, res: Response) {
  const {
    search,
    status = "ACTIVE",
    price_min,
    price_max,
    ...other_fields
  } = req.query;

  let searchKeys = {} as { name: string };

  let queryKeys = { ...other_fields, status } as QueryKeys;
  if (!req.user) queryKeys.status = "ACTIVE";
  if (price_min && price_max)
    queryKeys.price = { $gte: Number(price_min), $lte: Number(price_max) };
  if (
    req.user?.role != "ADMIN" &&
    req.user?.role != "SUPER_ADMIN" &&
    status != "ACTIVE"
  )
    queryKeys.user = req.user?._id;

  if (search) searchKeys.name = search as string;
  const result = await product_service.admin_get_all(
    queryKeys,
    searchKeys,
    req.user?._id as string,
  );
  sendResponse(res, HttpStatus.SUCCESS, result);
};

const get_product_details = async function (req: Request, res: Response) {
  const result = await product_service.get_details(
    req?.params?.id,
    req.user?._id as string,
  );
  sendResponse(res, HttpStatus.SUCCESS, result);
};

const update = async function (req: Request, res: Response) {
  const {
    retained_images: prev,
    deleted_images: del,
    img,
    status,
    ...data
  } = req.body;

  const retained_images = prev ? JSON.parse(prev) : [];
  const deleted_images = del ? JSON.parse(del) : [];

  let updated_images: string[] = [];

  if (retained_images) {
    updated_images = [...retained_images];
  }

  if (img) updated_images = [...updated_images, ...img];

  // Handle deleted images
  if (deleted_images && deleted_images.length > 0) {
    UnlinkFiles(deleted_images);
  }

  if (updated_images?.length > 0) data.img = updated_images;

  const result = await product_service.update_product(
    req?.params?.id,
    req?.user?._id as string,
    data,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const delete_product = async function (req: Request, res: Response) {
  const result = await product_service.delete_product(
    req?.params?.id,
    req?.user?._id as string,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const approve_product = async function (req: Request, res: Response) {
  const result = await product_service.approve_product(req?.params?.id);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const update_status = async function (req: Request, res: Response) {
  const { status } = req.body;
  const { role, _id } = req.user as IAuth;
  // if (role != "ADMIN" && role != "SUPER_ADMIN" && status == "ACTIVE") {
  //   throw new Error(`only admin can approve this product`);
  // }
  // if (role != "ADMIN" && role != "SUPER_ADMIN" && status == "REJECTED") {
  //   throw new Error(`only admin can reject this product`);
  // }
  const query = { _id: req.params.id } as any;
  if (role != "ADMIN" && role != "SUPER_ADMIN") {
    query.user = _id?.toString() as string
  }
  const result = await product_service.update_status(
    query,
    status,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
};

export const product_controller = Object.freeze({
  create,
  get_all,
  get_product_details,
  update,
  delete_product,
  approve_product,
  update_status,
  admin_get_all,
});
