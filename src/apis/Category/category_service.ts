import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UnlinkFiles } from "../../middleware/fileUploader";
import Aggregator from "../../utils/Aggregator";
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from "../Auth/auth_types";
import { service_model } from "../Service/service_model";
import { category_model } from "./category_model";
async function create(data: { [key: string]: string }) {
  const result = await category_model.create(data);
  return {
    success: true,
    message: "category created successfully",
    data: result,
  };
}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys) {
  return await Aggregator(category_model, queryKeys, searchKeys, [
    {
      $project: {
        _id: 1,
        name: 1,
        img: 1,
      },
    },
  ]);
}
async function get_category_services(
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
) {
  return await Aggregator(
    category_model,
    queryKeys,
    searchKeys,
    [
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "category",
          as: "sub_category",
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          img: { $first: "$img" },
          total_sub_category: { $first: { $size: "$sub_category" } },
          sub_categories: {
            $first: {
              $map: {
                input: "$sub_category",
                as: "sub_category",
                in: {
                  _id: "$$sub_category._id",
                  name: "$$sub_category.name",
                },
              },
            },
          },
        },
      },
    ],
    "end",
  );
}

async function update(id: string, data: { [key: string]: string }) {
  const category = await category_model.findById(id);

  if (!category) throw new Error("category not found");
  if (data?.img) UnlinkFiles([category?.img]);

  const result = await category_model.updateOne(
    { _id: id },
    {
      $set: {
        ...data,
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: "category updated successfully",
    data: result,
  };
}

async function delete_category(
  id: string,
  data: { [key: string]: string },
  auth: IAuth,
) {
  const is_exists = await category_model.findOne({ _id: id, name: data?.name });

  if (!is_exists) throw new Error(`category not found`);

  const is_pass_mass = await bcrypt.compare(data?.password, auth?.password);

  if (!is_pass_mass) throw new Error(`password doesn't match`);

  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    const [result] = await Promise.all([
      category_model.findByIdAndDelete(id, { session }),
      service_model.deleteMany({ category: id }, { session }),
    ]);
    return {
      success: true,
      message: "category deleted successfully",
      data: result,
    };
  } catch (error) {
    await session.startTransaction();
  } finally {
    await session.endSession();
  }
}

export const category_service = Object.freeze({
  create,
  get_all,
  get_category_services,
  update,
  delete_category,
});
