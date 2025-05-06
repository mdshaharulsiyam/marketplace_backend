import bcrypt from "bcrypt";
import { Request } from 'express';
import mongoose from "mongoose";
import Aggregator from "../../utils/Aggregator";
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from "../Auth/auth_types";
import { IPackage } from '../package/package_types';
import { payment_service } from '../Payment/payment_service';
import { service_model } from "../Service/service_model";
import { subscription_model } from "./subscription_model";
const create = async (data: any, packages: IPackage, req: Request) => {

  const is_exist: any = await subscription_model.findOne({ user: data?.user }).populate("subscription_id")
  if (is_exist && is_exist?.active) throw new Error(`you have already parched a subscription`)
  const price_data = [
    {
      name: is_exist?.subscription_id?.name ?? packages?.name,
      unit_amount: is_exist?.subscription_id?.price ? Number(is_exist?.subscription_id?.price) : Number(packages?.price),
      quantity: 1,
    }
  ]
  if (is_exist && !is_exist?.active) {
    return await payment_service.payment_session(req, price_data, undefined, "subscription")
  }

  if (!packages) throw new Error(`subscription package doesn't exist`)
  const date = new Date();

  packages?.type == "YEARLY" ? date.setFullYear(date.getFullYear() + 1) : date.setMonth(date.getMonth() + 1)

  data.expires_in = date

  await subscription_model.create(data);
  const session = await payment_service.payment_session(req, price_data, undefined, "subscription")
  return {
    success: true,
    message: "subscription created successfully",
    url: session?.url
  };
};

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys) => {
  return await Aggregator(subscription_model, queryKeys, searchKeys, []);
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
});
