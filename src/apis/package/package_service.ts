

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Aggregator from '../../utils/Aggregator';
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import { IAuth } from '../Auth/auth_types';
import { service_model } from '../Service/service_model';
import { package_model } from "./package_model";

const create = async (data: { [key: string]: string }) => {
  if (!data?.type) {
    throw new Error(`type is required`)
  }
  const result = await package_model.updateOne({
    type: data?.type
  }, data, { upsert: true })
  return {
    success: true,
    message: 'package created successfully',
  }
}

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys) => {
  return await Aggregator(package_model, queryKeys, searchKeys, [])
}

const update = async (id: string, data: { [key: string]: string }) => {
  const result = await package_model.findByIdAndUpdate(id, {
    $set: {
      ...data
    }
  }, { new: true })

  return {
    success: true,
    message: 'package updated successfully',
    data: result
  }
}

const delete_package = async (id: string, data: { [key: string]: string }, auth: IAuth) => {

  const is_exists = await package_model.findOne({ _id: id, name: data?.name })

  if (!is_exists) throw new Error("package not found")

  const is_pass_mass = await bcrypt.compare(data?.password, auth?.password)

  if (!is_pass_mass) throw new Error("password doesn't match")

  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const [result] = await Promise.all([
        package_model.findByIdAndDelete(id, { session }),
        service_model.deleteMany({ package: id }, { session }),
      ])
      return result
    })
    return {
      success: true,
      message: 'package deleted successfully',
      data: result
    }
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
}

export const package_service = Object.freeze({
  create,
  get_all,
  update,
  delete_package
})
