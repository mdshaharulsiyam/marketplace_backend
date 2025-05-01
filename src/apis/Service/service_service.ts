import { UnlinkFiles } from "../../middleware/fileUploader";
import Aggregator from '../../utils/Aggregator';
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { category_model } from "../Category/category_model";
import { service_model } from "./service_model";

async function create(data: { [key: string]: string }) {
  const category = await category_model.findById(data?.category);
  if (!category) throw new Error("category not found");

  const result = await service_model.insertMany(data);
  return {
    success: true,
    message: "service created successfully",
    data: result,
  };
}

async function update(id: string, data: { [key: string]: string }) {
  const [existing_service, category] = await Promise.all([
    ...(data?.category ? [category_model.findById(data?.category)] : []),
    service_model.findById(id),
  ]);

  if (!category && data?.category) throw new Error("category not found");
  if (!existing_service) throw new Error("service not found");

  const result = await service_model.updateOne(
    { _id: id },
    {
      $set: {
        ...data,
      },
    },
    { new: true },
  );

  if (data?.img) UnlinkFiles([existing_service?.img]);

  return {
    success: true,
    message: "service updated successfully",
    data: result,
  };
}

async function delete_service(id: string) {
  const existing_service = await service_model.findById(id);
  if (!existing_service) throw new Error("service not found");

  await service_model.findByIdAndDelete(id);

  return {
    success: true,
    message: "service deleted successfully",
    data: existing_service,
  };
}

async function get_all(
  queryKeys: QueryKeys,
  searchKeys: SearchKeys,
) {
  return await Aggregator(
    service_model,
    queryKeys,
    searchKeys,
    [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 1,
          name: 1,
          category_id: "$category._id",
          category_name: "$category.name"
        }
      }
    ], "end");
}

export const service_service = Object.freeze({
  create,
  get_all,
  update,
  delete_service,
});
