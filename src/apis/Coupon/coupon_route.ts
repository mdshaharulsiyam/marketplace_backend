import express from "express";

import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import uploadFile from "../../middleware/fileUploader";
import { coupon_controller } from "./coupon_controller";
import asyncWrapper from "../../middleware/asyncWrapper";

export const coupon_router = express.Router();

coupon_router
  .post(
    "/coupon/create",
    verifyToken(config.ADMIN),
    uploadFile(),
    asyncWrapper(coupon_controller.create),
  )
  .patch(
    "/coupon/update/:id",
    verifyToken(config.ADMIN),
    uploadFile(),
    asyncWrapper(coupon_controller.update),
  )
  .get("/coupon/get-all", asyncWrapper(coupon_controller.get_all))
  .delete(
    "/coupon/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(coupon_controller.delete_coupon),
  )

  .get(
    "/coupon/check-coupon/:name/:id",
    asyncWrapper(coupon_controller.check_coupon),
  );
