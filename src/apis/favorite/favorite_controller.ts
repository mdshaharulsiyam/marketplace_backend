
import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { sendResponse } from "../../utils/sendResponse";
import { IAuth } from '../Auth/auth_types';
import { SearchKeys } from './../../utils/Queries';
import { favorite_service } from "./favorite_service";

const create = async (req: Request, res: Response) => {
  const result = await favorite_service.create({ product: req?.body?.product, user: req.user?._id })
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
