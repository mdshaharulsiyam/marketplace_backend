import { Request, Response } from "express";
import config, { HttpStatus } from "../../DefaultConfig/config";
import { QueryKeys, SearchKeys } from "../../utils/Aggregator";
import { sendResponse } from "../../utils/sendResponse";
import { auth_service } from "./auth_service";
import { IAuth } from "./auth_types";

async function create(req: Request, res: Response) {
  const result = await auth_service.sign_up(req.body);

  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function sing_in(req: Request, res: Response) {
  const result = await auth_service.sing_in(req.body);

  sendResponse(res, HttpStatus.SUCCESS, result, [
    config.TOKEN_NAME,
    result?.token,
    60 * 60 * 24 * 500 * 1000,
  ]);
}

async function sing_out(req: Request, res: Response) {
  res.clearCookie(config.TOKEN_NAME);
  res
    .cookie(config.TOKEN_NAME, "", {
      maxAge: 0,
      expires: new Date(),
      sameSite: "none",
      httpOnly: false,
      secure: false,
    })
    .status(200)
    .send({ success: true, message: "user sign out successfully" });
}

async function block_auth(req: Request, res: Response) {
  const result = await auth_service.block_auth(req?.params?.id);
  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function get_profile(req: Request, res: Response) {
  const result = await auth_service.get_profile(req?.user as IAuth);

  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function update_auth(req: Request, res: Response) {
  const {
    is_identity_verified,
    is_verified,
    role,
    email,
    accessToken,
    confirm_password,
    provider,
    block,
    documents,
    img,
    ...otherValues
  } = req?.body;
  if (img) otherValues.img = img?.[0]
  const result = await auth_service.update_auth(
    {
      ...otherValues,
      ...(documents ? documents : {}),
    },
    req?.user as IAuth,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function reset_password(req: Request, res: Response) {
  const result = await auth_service.reset_password(
    req?.body,
    req?.user as IAuth,
  );

  sendResponse(res, HttpStatus.SUCCESS, result, [
    config.TOKEN_NAME,
    result?.token,
    60 * 60 * 24 * 500 * 1000,
  ]);
}

async function change_password(req: Request, res: Response) {
  const result = await auth_service.change_password(
    req?.body,
    req?.user as IAuth,
  );

  sendResponse(res, HttpStatus.SUCCESS, result, [
    config.TOKEN_NAME,
    result?.token,
    60 * 60 * 24 * 500 * 1000,
  ]);
}

async function verify_identity(req: Request, res: Response) {
  const result = await auth_service.verify_identity(req?.params?.id);

  sendResponse(res, HttpStatus.SUCCESS, result);
}
async function get_all(req: Request, res: Response) {
  const { search, role = "USER", ...otherValues } = req?.query;
  const searchKeys: SearchKeys = {};

  if (search) searchKeys.name = search as string;

  const queryKeys = {
    ...otherValues,
    role,
  } as QueryKeys;

  const result = await auth_service.get_all(queryKeys, searchKeys);

  sendResponse(res, HttpStatus.SUCCESS, result);
}
async function get_details(req: Request, res: Response) {
  const { id } = req.params;
  const result = await auth_service.get_details(id);
  sendResponse(res, HttpStatus.SUCCESS, result);
}

export const auth_controller = Object.freeze({
  create,
  sing_in,
  sing_out,
  block_auth,
  get_profile,
  update_auth,
  reset_password,
  change_password,
  verify_identity,
  get_all,
  get_details,
});
