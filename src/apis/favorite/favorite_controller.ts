
import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { QueryKeys } from '../../utils/Aggregator';
import { sendResponse } from "../../utils/sendResponse";
import { IAuth } from '../Auth/auth_types';
import { SearchKeys } from './../../utils/Queries';
import { favorite_service } from "./favorite_service";

const create = async (req: Request, res: Response) => {
  const is_exist = req.extra?.is_exist?.length > 0
  const result = await favorite_service.create({ product: req.params.product, user: req.user?._id }, is_exist)
  sendResponse(
    res,
    HttpStatus.CREATED,
    result
  )
}

const get_all = async (req: Request, res: Response) => {

  const { search, ...otherValues } = req?.query;
  const searchKeys: SearchKeys = {}
  const { _id } = req?.user as IAuth
  if (search) searchKeys.name = search as string

  const queryKeys = {
    ...otherValues,
    user: _id
  } as QueryKeys

  const result = await favorite_service.get_all(queryKeys, searchKeys)
  sendResponse(
    res,
    HttpStatus.SUCCESS,
    result
  )
}


const update = async (req: Request, res: Response) => {
  const img = !Array.isArray(req.files) && req.files?.img && req.files.img.length > 0 && req.files.img[0]?.path || null;

  if (img) req.body.img = img

  const result = await favorite_service.update(req?.params?.id, req?.body)
  sendResponse(
    res,
    HttpStatus.SUCCESS,
    result
  )
}

const delete_favorite = async (req: Request, res: Response) => {

  const result = await favorite_service.delete_favorite(req?.params?.id, req?.body, req?.user as IAuth)
  sendResponse(
    res,
    HttpStatus.SUCCESS,
    result
  )
}

export const favorite_controller = {
  create,
  get_all,
  update,
  delete_favorite
}
