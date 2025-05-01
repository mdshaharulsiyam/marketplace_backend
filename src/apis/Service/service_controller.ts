import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { sendResponse } from "../../utils/sendResponse";
import { SearchKeys } from "./../../utils/Queries";
import { service_service } from "./service_service";

async function create(req: Request, res: Response) {
  const result = await service_service.create(req?.body);
  sendResponse(res, HttpStatus.CREATED, result);
}

async function get_all(req: Request, res: Response) {
  const { search, ...otherValues } = req?.query;
  const searchKeys: SearchKeys = {};

  if (search) searchKeys.name = search as string;

  const queryKeys = {
    ...otherValues,
  };
  const result = await service_service.get_all(
    queryKeys,
    searchKeys,
  );
  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function update(req: Request, res: Response) {
  const result = await service_service.update(req?.params?.id, req?.body);
  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function delete_service(req: Request, res: Response) {
  const result = await service_service.delete_service(req?.params?.id); // req?.body, req?.user as IAuth
  console.log(result)
  sendResponse(res, HttpStatus.SUCCESS, result);
}

export const category_controller = {
  create,
  get_all,
  update,
  delete_service,
};
