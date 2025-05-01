import { UnlinkFiles } from "../../middleware/fileUploader";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { business_model } from "../Business/business_model";
import { product_model } from "./product_model";
import IProduct from "./product_type";
// interface IParameters extends IProduct {
//     deleted_images: string
//     retained_images: string
//     coupon_code: string
// }
const create = async (body: IProduct) => {
  const is_exist = await business_model.findOne({
    _id: body.business,
    $or: [{ user: body.user }, { user: [{ $in: [body.user] }] }],
  });

  if (!is_exist) throw new Error("Business not found");

  const result = await product_model.create(body);

  return {
    success: true,
    message: "product created successfully",
    data: result,
  };
};

const get_all = async (
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
  populatePath?: string | string[],
  selectFields?: string | string[],
  modelSelect?: string,
) => {
  return await Queries(
    product_model,
    queryKeys,
    searchKeys,
    populatePath,
    selectFields,
    modelSelect,
  );
};

const get_details = async (id: string) => {
  const product = await product_model
    .findById(id)
    .populate("category subCategory user");
  return {
    success: true,
    message: "product data retrieved successfully",
    data: product,
  };
};

const update_product = async (id: string, user: string, body: IProduct) => {
  const is_exist = await business_model.findOne({
    _id: body.business,
    $or: [{ user: user }, { user: [{ $in: [user] }] }],
  });

  if (!is_exist) throw new Error("Business not found");

  const result = await product_model.findOneAndUpdate(
    { _id: id, user },
    {
      $set: {
        ...body,
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: "product updated successfully",
    data: result,
  };
};

const delete_product = async (id: string, user: string) => {
  const is_exist = await business_model.findOne({
    $or: [{ user: user }, { user: [{ $in: [user] }] }],
  });

  if (!is_exist) throw new Error("Business not found");

  const product = await product_model.findOne({ _id: id, user });

  if (!product) throw new Error("Product not found");

  if (product?.img) UnlinkFiles(product?.img);

  const result = await product_model.findOneAndDelete({ _id: id, user });

  return {
    success: true,
    message: "product deleted successfully",
    data: result,
  };
};

const approve_product = async (id: string) => {
  const result = await product_model.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        is_approved: true,
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: "product approved successfully",
    data: result,
  };
};

const feature_product = async (id: string) => {
  const result = await product_model.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        $cond: {
          if: { $eq: ["$is_featured", false] },
          then: true,
          else: false,
        },
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: `product ${result?.is_featured ? "featured" : "removed from featured"} successfully`,
    data: result,
  };
};

export const product_service = Object.freeze({
  create,
  get_all,
  get_details,
  update_product,
  delete_product,
  approve_product,
  feature_product,
});
