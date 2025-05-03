import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { sendResponse } from "../../utils/sendResponse";
import { SearchKeys } from "./../../utils/Queries";
import { city_service } from "./city_service";

const create = async (req: Request, res: Response) => {
  const result = await city_service.create(req?.body);
  sendResponse(res, HttpStatus.CREATED, result);
};

const get_all = async (req: Request, res: Response) => {
  const { search, ...otherValues } = req?.query;
  const searchKeys: SearchKeys = {};

  if (search) searchKeys.name = search as string;

  const queryKeys = {
    ...otherValues,
  };

  const result = await city_service.get_all(queryKeys, searchKeys);
  sendResponse(res, HttpStatus.SUCCESS, result);
};

const update = async (req: Request, res: Response) => {
  const result = await city_service.update(req?.params?.id, req?.body);
  sendResponse(res, HttpStatus.SUCCESS, result);
};

const delete_city = async (req: Request, res: Response) => {
  const result = await city_service.delete_city(req?.params?.id);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

export const city_controller = {
  create,
  get_all,
  update,
  delete_city,
};
