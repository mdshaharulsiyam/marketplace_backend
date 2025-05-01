import { Request, Response } from "express";
import { banner_service } from "./banner_service";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";

const create = async (req: Request, res: Response) => {
  const img =
    (!Array.isArray(req.files) &&
      req.files?.img &&
      req.files.img.length > 0 &&
      req.files.img[0]?.path) ||
    null;

  req.body.img = img;
  const result = await banner_service.create(req?.body);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  const img =
    (!Array.isArray(req.files) &&
      req.files?.img &&
      req.files.img.length > 0 &&
      req.files.img[0]?.path) ||
    null;

  if (img) req.body.img = img;

  const result = await banner_service.update(id, req?.body);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const delete_banner = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await banner_service.delete_banner(id);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const get_all = async (req: Request, res: Response) => {
  let searchKeys = {};

  const { search, ...otherFields } = req.query;
  const queryKeys = { ...otherFields };

  const result = await banner_service.get_all(queryKeys, searchKeys);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

export const banner_controller = Object.freeze({
  create,
  update,
  delete_banner,
  get_all,
});
