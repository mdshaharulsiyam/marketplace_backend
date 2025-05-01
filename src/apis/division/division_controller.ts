
import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { sendResponse } from "../../utils/sendResponse";
import { IAuth } from '../Auth/auth_types';
import { SearchKeys } from './../../utils/Queries';
import { division_service } from "./division_service";

const create = async (req: Request, res: Response) => {
  const result = await division_service.create(req?.body)
  sendResponse(
    res,
    HttpStatus.CREATED,
    result
  )
}

const get_all = async (req: Request, res: Response) => {

  const { search, ...otherValues } = req?.query;
  const searchKeys: SearchKeys = {}

  if (search) searchKeys.name = search as string

  const queryKeys = {
    ...otherValues
  }

  const result = await division_service.get_all(queryKeys, searchKeys)
  sendResponse(
    res,
    HttpStatus.SUCCESS,
    result
  )
}


const update = async (req: Request, res: Response) => {
  const result = await division_service.update(req?.params?.id, req?.body)
  sendResponse(
    res,
    HttpStatus.SUCCESS,
    result
  )
}

const delete_division = async (req: Request, res: Response) => {

  const result = await division_service.delete_division(req?.params?.id, req?.body, req?.user as IAuth)
  sendResponse(
    res,
    HttpStatus.SUCCESS,
    result
  )
}

export const division_controller = {
  create,
  get_all,
  update,
  delete_division
}
