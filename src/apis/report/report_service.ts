

import mongoose, { model } from 'mongoose';
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { report_model } from "./report_model";
import { service_model } from '../Service/service_model';
import { IAuth } from '../Auth/auth_types';
import bcrypt from 'bcrypt'
import Aggregator from '../../utils/Aggregator';

const create =async(data: { [key: string]: string })=> {
    const result = await report_model.create(data)
    return {
        success: true,
        message: 'report created successfully',
        data: result
    }
}

const get_all = async(queryKeys: QueryKeys, searchKeys: SearchKeys)=> {
    return await Aggregator(report_model, queryKeys, searchKeys, [])
}

const update=async(id: string, data: { [key: string]: string }) =>{
    const result = await report_model.findByIdAndUpdate(id, {
        $set: {
            ...data
        }
    }, { new: true })

    return {
        success: true,
        message: 'report updated successfully',
        data: result
    }
}

const delete_report=async(id: string, data: { [key: string]: string }, auth: IAuth)=> {

    const is_exists = await report_model.findOne({ _id: id, name: data?.name })

    if (!is_exists) throw new Error("report not found")

    const is_pass_mass = await bcrypt.compare(data?.password, auth?.password)

    if (!is_pass_mass) throw new Error("password doesn't match")

const session = await mongoose.startSession();
try {
  const result = await session.withTransaction(async () => {
    const [result] = await Promise.all([
      report_model.findByIdAndDelete(id, { session }),
      service_model.deleteMany({ report: id }, { session }),
            ])
  return result
})
return {
  success: true,
  message: 'report deleted successfully',
  data: result
}
    } catch (error) {
  throw error;
} finally {
  await session.endSession();
}
}

export const report_service = Object.freeze({
  create,
  get_all,
  update,
  delete_report
})  
    