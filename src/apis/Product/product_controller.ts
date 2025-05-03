import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { UnlinkFiles } from "../../middleware/fileUploader";
import { sendResponse } from "../../utils/sendResponse";
import { product_service } from "./product_service";

const create = async function (req: Request, res: Response) {

  req.body.user = req?.user?._id?.toString();

  const result = await product_service.create(req.body);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const get_all = async function (req: Request, res: Response) {
  const { search, order, ...other_fields } =
    req.query;

  let searchKeys = {} as { name: string };

  let queryKeys = { ...other_fields };

  if (search) searchKeys.name = search as string;
  const result = await product_service.get_all(
    queryKeys,
    searchKeys,
  );
  sendResponse(res, HttpStatus.SUCCESS, result);
};

const get_product_details = async function (req: Request, res: Response) {
  const result = await product_service.get_details(req?.params?.id);
  sendResponse(res, HttpStatus.SUCCESS, result);
};

const update = async function (req: Request, res: Response) {
  const { retained_images: prev, deleted_images: del, ...data } = req.body;

  const retained_images = JSON.parse(prev);
  const deleted_images = JSON.parse(del);

  let updated_images: string[] = [];
  if (retained_images && deleted_images.length > 0) {
    updated_images = [...retained_images];
  }
  // Handle image upload
  const img =
    (!Array.isArray(req.files) &&
      req.files?.img &&
      req.files.img.length > 0 &&
      req.files.img?.map((doc: any) => doc.path)) ||
    null;

  if (img) updated_images = [...updated_images, ...img];

  // Handle deleted images
  if (deleted_images && deleted_images.length > 0) {
    UnlinkFiles(deleted_images);
  }

  data.img = updated_images;

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

const feature_product = async function (req: Request, res: Response) {
  const result = await product_service.feature_product(req?.params?.id);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

export const product_controller = Object.freeze({
  create,
  get_all,
  get_product_details,
  update,
  delete_product,
  approve_product,
  feature_product,
});
