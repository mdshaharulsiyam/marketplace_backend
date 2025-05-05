import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Aggregator from "../../utils/Aggregator";
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from "../Auth/auth_types";
import { service_model } from "../Service/service_model";
import { division_model } from "./division_model";

const create = async (data: { [key: string]: string }) => {
  const result = await division_model.create(data);
  return {
    success: true,
    message: "division created successfully",
    data: result,
  };
};

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys) => {
  return await Aggregator(
    division_model,
    queryKeys,
    searchKeys,
    [
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ],
    "end",
  );
};

const update = async (id: string, data: { [key: string]: string }) => {
  const result = await division_model.findByIdAndUpdate(
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
    message: "division updated successfully",
    data: result,
  };
};

const delete_division = async (
  id: string,
  data: { [key: string]: string },
  auth: IAuth,
) => {
  const is_exists = await division_model.findOne({ _id: id, name: data?.name });

  if (!is_exists) throw new Error("division not found");

  const is_pass_mass = await bcrypt.compare(data?.password, auth?.password);

  if (!is_pass_mass) throw new Error("password doesn't match");

  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const [result] = await Promise.all([
        division_model.findByIdAndDelete(id, { session }),
        service_model.deleteMany({ division: id }, { session }),
      ]);
      return result;
    });
    return {
      success: true,
      message: "division deleted successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const division_service = Object.freeze({
  create,
  get_all,
  update,
  delete_division,
});
