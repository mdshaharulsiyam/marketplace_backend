import Aggregator from "../../utils/Aggregator";
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { city_model } from "./city_model";

const create = async (data: { [key: string]: string }) => {
  const result = await city_model.create(data);
  return {
    success: true,
    message: "city created successfully",
    data: result,
  };
};

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys) => {
  return await Aggregator(city_model, queryKeys, searchKeys, [
    {
      $lookup: {
        from: "divisions",
        foreignField: "_id",
        localField: "division",
        as: "division",
      },
    },
    {
      $unwind: {
        path: "$division",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        division_name: "$division.name",
        division_id: "$division._id",
      },
    },
  ]);
};

const update = async (id: string, data: { [key: string]: string }) => {
  const result = await city_model.findByIdAndUpdate(
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
    message: "city updated successfully",
    data: result,
  };
};

const delete_city = async (id: string) => {
  const result = await city_model.findByIdAndDelete(id);

  return {
    success: true,
    message: "city deleted successfully",
    data: result,
  };
};

export const city_service = Object.freeze({
  create,
  get_all,
  update,
  delete_city,
});
