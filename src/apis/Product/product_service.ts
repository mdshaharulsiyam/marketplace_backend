import mongoose from "mongoose";
import { UnlinkFiles } from "../../middleware/fileUploader";
import Aggregator from "../../utils/Aggregator";
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { subscription_model } from "./../subscription/subscription_model";
import { product_model } from "./product_model";
import IProduct from "./product_type";
// interface IParameters extends IProduct {
//     deleted_images: string
//     retained_images: string
//     coupon_code: string
// }
const create = async (body: IProduct) => {
  const subscription = await subscription_model.findOne({ user: body?.user });

  if (!subscription)
    throw new Error(`please parches subscription for add product`);
  if (!subscription?.active)
    throw new Error(`your subscription payment is pending`);
  if (subscription?.expires_in < new Date())
    throw new Error(`your subscription is expired`);

  await product_model.create(body);

  return {
    success: true,
    message: "product created successfully",
  };
};

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys) => {
  return await Aggregator(
    product_model,
    queryKeys,
    searchKeys,
    [
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "category",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "favorites",
          localField: "_id",
          foreignField: "product",
          as: "favorites",
        },
      },
      {
        $project: {
          is_favorite: {
            $cond: {
              if: { $gt: [{ $size: "$favorites" }, 0] },
              then: true,
              else: false,
            },
          },
          _id: 1,
          name: 1,
          price: 1,
          img: { $arrayElemAt: ["$img", 0] },
          condition: 1,
          category_name: {
            $ifNull: [{ $arrayElemAt: ["$category.name", 0] }, null],
          },
        },
      },
    ],
    "start",
  );
};

const get_details = async (id: string) => {
  const product: any = await product_model.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "categories",
        foreignField: "_id",
        localField: "category",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "auths",
        foreignField: "_id",
        localField: "user",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "services",
        foreignField: "_id",
        localField: "sub_category",
        as: "sub_category",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        price: 1,
        description: 1,
        img: 1,
        condition: 1,
        category_name: {
          $ifNull: [{ $arrayElemAt: ["$category.name", 0] }, null],
        },
        category_id: {
          $ifNull: [{ $arrayElemAt: ["$category._id", 0] }, null],
        },
        sub_category_name: {
          $ifNull: [{ $arrayElemAt: ["$sub_category.name", 0] }, null],
        },
        user_name: { $ifNull: [{ $arrayElemAt: ["$user.name", 0] }, null] },
        user_email: { $ifNull: [{ $arrayElemAt: ["$user.email", 0] }, null] },
        user_phone: { $ifNull: [{ $arrayElemAt: ["$user.phone", 0] }, null] },
        user_img: { $ifNull: [{ $arrayElemAt: ["$user.img", 0] }, null] },
        user_id: { $ifNull: [{ $arrayElemAt: ["$user._id", 0] }, null] },
      },
    },
  ]);
  const related_product = await product_model.aggregate([
    {
      $match: {
        category: product[0]?.category_id,
        _id: { $ne: new mongoose.Types.ObjectId(id) },
        status: "ACTIVE",
      },
    },
    {
      $lookup: {
        from: "categories",
        foreignField: "_id",
        localField: "category",
        as: "category",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        price: 1,
        img: { $arrayElemAt: ["$img", 0] },
        condition: 1,
        category_name: {
          $ifNull: [{ $arrayElemAt: ["$category.name", 0] }, null],
        },
      },
    },
    {
      $skip: 0,
    },
    {
      $limit: 10,
    },
  ]);
  // .find({

  // })
  // .skip(0)
  // .limit(8);
  return {
    success: true,
    message: "product data retrieved successfully",
    data: product?.[0],
    related_product: related_product ? related_product : [],
  };
};

const update_product = async (id: string, user: string, body: IProduct) => {
  await product_model.findOneAndUpdate(
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
  };
};

const delete_product = async (id: string, user: string) => {
  const product = await product_model.findOne({ _id: id, user });

  if (!product) throw new Error("Product not found");

  if (product?.img) UnlinkFiles(product?.img);

  await product_model.findOneAndDelete({ _id: id, user });

  return {
    success: true,
    message: "product deleted successfully",
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
  };
};

const update_status = async (id: string, user: string, status: string) => {
  await product_model.findOneAndUpdate(
    { _id: id, user },
    {
      $set: {
        status,
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: `product ${status} successfully`,
  };
};

export const product_service = Object.freeze({
  create,
  get_all,
  get_details,
  update_product,
  delete_product,
  approve_product,
  update_status,
});
