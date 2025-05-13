import bcrypt from "bcrypt";
import { Request } from "express";
import mongoose from "mongoose";
import Aggregator from "../../utils/Aggregator";
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from "../Auth/auth_types";
import { IPackage } from "../package/package_types";
import { payment_service } from "../Payment/payment_service";
import { service_model } from "../Service/service_model";
import { subscription_model } from "./subscription_model";

const create = async (data: any, packages: IPackage, req: Request) => {
  const is_exist: any = await subscription_model
    .findOne({ user: data?.user })
    .populate("subscription_id");
  if (is_exist && is_exist?.active)
    throw new Error(`you have already parched a subscription`);
  const price_data = [
    {
      name: is_exist?.subscription_id?.name ?? packages?.name,
      unit_amount: is_exist?.subscription_id?.price
        ? Number(is_exist?.subscription_id?.price)
        : Number(packages?.price),
      quantity: 1,
    },
  ];
  if (is_exist && !is_exist?.active) {
    return await payment_service.payment_session(
      req,
      price_data,
      undefined,
      "subscription",
    );
  }

  if (!packages) throw new Error(`subscription package doesn't exist`);
  const date = new Date();

  packages?.type == "YEARLY"
    ? date.setFullYear(date.getFullYear() + 1)
    : date.setMonth(date.getMonth() + 1);

  data.expires_in = date;

  await subscription_model.create(data);
  const session = await payment_service.payment_session(
    req,
    price_data,
    undefined,
    "subscription",
  );
  return {
    success: true,
    message: "subscription created successfully",
    url: session?.url,
  };
};

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys) => {
  return await Aggregator(subscription_model, queryKeys, searchKeys, []);
};

const get_my_subscription = async (user: string) => {
  const result = await subscription_model.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user),
      },
    },
    {
      $lookup: {
        from: "packages",
        foreignField: "_id",
        localField: "subscription_id",
        as: "subscription_id",
      },
    },
    {
      $project: {
        type: { $arrayElemAt: ["$subscription_id.type", 0] },
        price: { $arrayElemAt: ["$subscription_id.price", 0] },
        name: { $arrayElemAt: ["$subscription_id.name", 0] },
        subscription_id: { $arrayElemAt: ["$subscription_id._id", 0] },
        expires_in: 1,
        left_days: {
          $cond: {
            if: {
              $lte: ["$expires_in", new Date()],
            },
            then: "Expired",
            else: {
              $ceil: {
                $divide: [
                  {
                    $subtract: ["$expires_in", new Date()],
                  },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
          },
        },
        active: 1,
      },
    },
  ]);
  return {
    success: true,
    message: `subscription retrieve successfully`,
    data: result?.[0],
  };
};
const update = async (id: string, data: { [key: string]: string }) => {
  const result = await subscription_model.findByIdAndUpdate(
    id,
    {
      $set: {
        ...data,
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: "subscription updated successfully",
    data: result,
  };
};

const renew = async (data: any, packages: IPackage, req: Request) => {
  const is_exist = await subscription_model.findOne({ user: data?.user });

  if (!is_exist) throw new Error(`no subscription package is active`);

  if (is_exist && !is_exist?.active)
    throw new Error(`you don't have subscription to renew`);

  const extra_date = is_exist?.expires_in as Date;

  const price_data = [
    {
      name: packages?.name,
      unit_amount: Number(packages?.price),
      quantity: 1,
    },
  ];

  if (!packages) throw new Error(`subscription package doesn't exist`);

  const date = new Date(extra_date);

  packages?.type == "YEARLY"
    ? date.setFullYear(date.getFullYear() + 1)
    : date.setMonth(date.getMonth() + 1);

  data.expires_in = date;
  data.active = false;

  await subscription_model.findByIdAndUpdate(is_exist?._id, {
    $set: {
      ...data,
    },
  });
  const session = await payment_service.payment_session(
    req,
    price_data,
    undefined,
    "subscription",
  );
  return {
    success: true,
    message: "subscription renew successfully",
    url: session?.url,
  };
};

const delete_subscription = async (
  id: string,
  data: { [key: string]: string },
  auth: IAuth,
) => {
  const is_exists = await subscription_model.findOne({
    _id: id,
    name: data?.name,
  });

  if (!is_exists) throw new Error("subscription not found");

  const is_pass_mass = await bcrypt.compare(data?.password, auth?.password);

  if (!is_pass_mass) throw new Error("password doesn't match");

  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const [result] = await Promise.all([
        subscription_model.findByIdAndDelete(id, { session }),
        service_model.deleteMany({ subscription: id }, { session }),
      ]);
      return result;
    });
    return {
      success: true,
      message: "subscription deleted successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const subscription_service = Object.freeze({
  create,
  get_all,
  update,
  delete_subscription,
  get_my_subscription,
  renew,
});
