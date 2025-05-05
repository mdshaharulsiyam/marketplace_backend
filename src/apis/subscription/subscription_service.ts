import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Aggregator from "../../utils/Aggregator";
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from "../Auth/auth_types";
import { IFavorite } from "../favorite/favorite_types";
import { service_model } from "../Service/service_model";
import { subscription_model } from "./subscription_model";

const create = async (data: IFavorite) => {
  const is_exist = await subscription_model.findOne({ user: data?.user });
  const result = await subscription_model.create(data);
  return {
    success: true,
    message: "subscription created successfully",
    data: result,
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
