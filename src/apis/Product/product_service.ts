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

const get_all = async (
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
  user: string,
) => {
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
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$favorites",
                        as: "favorite",
                        cond: {
                          $and: [
                            { $eq: ["$$favorite.user", user] },
                            { $eq: ["$$favorite.product", "$_id"] },
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
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
const admin_get_all = async (
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
  user: string,
) => {
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
        $lookup: {
          from: "favorites",
          localField: "_id",
          foreignField: "product",
          as: "favorites",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          status: 1,
          description: 1,
          img: 1,
          is_favorite: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$favorites",
                        as: "favorite",
                        cond: {
                          $and: [
                            { $eq: ["$$favorite.user", user] },
                            { $eq: ["$$favorite.product", "$_id"] },
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
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
    ],
    "start",
  );
};

const get_details = async (id: string, user: string) => {
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
      $lookup: {
        from: "divisions",
        foreignField: "_id",
        localField: "division",
        as: "division",
      },
    },
    {
      $lookup: {
        from: "cities",
        foreignField: "_id",
        localField: "city",
        as: "city",
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
        _id: 1,
        name: 1,
        price: 1,
        description: 1,
        img: 1,
        is_favorite: {
          $cond: {
            if: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$favorites",
                      as: "favorite",
                      cond: {
                        $and: [
                          { $eq: ["$$favorite.user", user] },
                          { $eq: ["$$favorite.product", "$_id"] },
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
            then: true,
            else: false,
          },
        },
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
        categories: {
          $cond: {
            if: { $gt: [{ $size: { $ifNull: ["$category", []] } }, 0] },
            then: {
              name: { $ifNull: [{ $arrayElemAt: ["$category.name", 0] }, null], },
              img: { $ifNull: [{ $arrayElemAt: ["$category.img", 0] }, null], },
              _id: { $ifNull: [{ $arrayElemAt: ["$category._id", 0] }, null], },
            },
            else: null
          }
        },
        sub_categories: {
          $cond: {
            if: { $gt: [{ $size: { $ifNull: ["$sub_category", []] } }, 0] },
            then: {
              name: { $ifNull: [{ $arrayElemAt: ["$sub_category.name", 0] }, null], },
              _id: { $ifNull: [{ $arrayElemAt: ["$sub_category._id", 0] }, null], },
            },
            else: null
          }
        },
        divisions: {
          $cond: {
            if: { $gt: [{ $size: { $ifNull: ["$division", []] } }, 0] },
            then: {
              name: { $ifNull: [{ $arrayElemAt: ["$division.name", 0] }, null], },
              _id: { $ifNull: [{ $arrayElemAt: ["$division._id", 0] }, null], }
            },
            else: null
          }
        },
        cities: {
          $cond: {
            if: { $gt: [{ $size: { $ifNull: ["$city", []] } }, 0] },
            then: {
              name: { $ifNull: [{ $arrayElemAt: ["$city.name", 0] }, null], },
              _id: { $ifNull: [{ $arrayElemAt: ["$city._id", 0] }, null], }
            },
            else: null
          }
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
        // status: "PENDING"
        status: "ACTIVE",
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

const update_status = async (query: any, status: string) => {
  await product_model.findOneAndUpdate(
    query,
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
  admin_get_all,
});
/*
default 1111


*/