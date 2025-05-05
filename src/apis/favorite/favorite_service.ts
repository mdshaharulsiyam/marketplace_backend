

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Aggregator from '../../utils/Aggregator';
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from '../Auth/auth_types';
import { service_model } from '../Service/service_model';
import { favorite_model } from "./favorite_model";

const create = async (data: any, is_exist: boolean) => {
  if (is_exist) {
    await favorite_model.deleteOne(data)
  } else {
    await favorite_model.create(data)
  }
  return {
    success: true,
    message: `favorite ${is_exist ? "removed" : "added"} successfully`,
  }
}

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys) => {
  return await Aggregator(favorite_model, queryKeys, searchKeys, [

  ])
}

const update = async (id: string, data: { [key: string]: string }) => {
  const result = await favorite_model.findByIdAndUpdate(id, {
    $set: {
      ...data
    }
  }, { new: true })

  return {
    success: true,
    message: 'favorite updated successfully',
    data: result
  }
}

const delete_favorite = async (id: string, data: { [key: string]: string }, auth: IAuth) => {

  const is_exists = await favorite_model.findOne({ _id: id, name: data?.name })

  if (!is_exists) throw new Error("favorite not found")

  const is_pass_mass = await bcrypt.compare(data?.password, auth?.password)

  if (!is_pass_mass) throw new Error("password doesn't match")

  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const [result] = await Promise.all([
        favorite_model.findByIdAndDelete(id, { session }),
        service_model.deleteMany({ favorite: id }, { session }),
      ])
      return result
    })
    return {
      success: true,
      message: 'favorite deleted successfully',
      data: result
    }
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
}

export const favorite_service = Object.freeze({
  create,
  get_all,
  update,
  delete_favorite
})
