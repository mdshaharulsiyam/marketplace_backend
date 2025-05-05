import express from "express";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import uploadFile from "../../middleware/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import verifyToken from "../../middleware/verifyToken";
import { product_controller } from "./product_controller";
import { product_validate } from "./product_validate";

export const product_router = express.Router();

product_router
  .post(
    "/product/create",
    uploadFile(),
    validateRequest(product_validate.create_validate),
    verifyToken(config.VENDOR),
    asyncWrapper(product_controller.create),
  )

  .get(
    "/product/get-all",
    verifyToken(config.USER, false),
    asyncWrapper(product_controller.get_all),
  )

  .get(
    "/product/get-details/:id",
    asyncWrapper(product_controller.get_product_details),
  )

  .patch(
    "/product/update/:id",
    uploadFile(),
    validateRequest(product_validate.update_validate),
    verifyToken(config.VENDOR),
    asyncWrapper(product_controller.update),
  )

  .delete(
    "/product/delete/:id",
    verifyToken(config.USER),
    asyncWrapper(product_controller.delete_product),
  )

  // .patch(
  //   "/product/approve/:id",
  //   verifyToken(config.ADMIN),
  //   asyncWrapper(product_controller.approve_product),
  // )

  .patch(
    "/product/status/:id",
    verifyToken(config.USER),
    asyncWrapper(product_controller.update_status),
  );
