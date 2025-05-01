import { Request, Response } from "express";
import { product_service } from "./product_service";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";
import { UnlinkFiles } from "../../middleware/fileUploader";

const create = async function (req: Request, res: Response) {
  const { deleted_images, retained_images, coupon_code, ...data } = req.body;

  if (coupon_code !== "undefined" && coupon_code) {
    data.coupon = {
      available: true,
      coupon_code: coupon_code,
    };
  }
  const img =
    (!Array.isArray(req.files) &&
      req.files?.img &&
      req.files.img.length > 0 &&
      req.files.img?.map((doc: any) => doc.path)) ||
    null;

  if (img && img?.length > 0) data.img = img;

  data.user = req?.user?._id;

  const result = await product_service.create(data);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const get_all = async function (req: Request, res: Response) {
  const { search, popular, featured, order, sub_category, ...other_fields } =
    req.query;

  const populatePath = ["category", "subCategory", "user"];
  const selectFields = ["_id name", "_id name", "_id"];

  let searchKeys = {} as { name: string };

  let queryKeys = { ...other_fields };

  if (search) searchKeys.name = search as string;
  let result;
  if (popular) {
    result = await product_service.get_all(
      { sort: "stock", limit: "12", page: "1" },
      searchKeys,
      populatePath,
      selectFields,
      "_id name price discount img",
    );
  } else if (featured) {
    result = await product_service.get_all(
      { isFeatured: true, limit: "25", page: "1" },
      searchKeys,
      populatePath,
      selectFields,
      "_id name price discount img",
    );
  } else if (order && typeof order === "string") {
    const _ids = order.split(",").map((order_id) => order_id.trim());

    const product_ids = { _id: { $in: _ids } };

    result = await product_service.get_all(
      { ...product_ids },
      searchKeys,
      populatePath,
      selectFields,
      "_id name price discount img",
    );
  } else {
    if (sub_category && typeof sub_category === "string") {
      const sub_category_array = sub_category
        .split(",")
        .map((sub_category) => ({
          subCategory: sub_category,
        }));

      queryKeys.$or = sub_category_array;
    }
    result = await product_service.get_all(
      queryKeys,
      searchKeys,
      populatePath,
      selectFields,
      "_id name price discount img",
    );
  }
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
