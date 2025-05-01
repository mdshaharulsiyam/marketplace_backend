import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import { product_controller } from "./product_controller";

export const product_router = express.Router();

product_router
  .post(
    "/product/create",
    verifyToken(config.VENDOR),
    asyncWrapper(product_controller.create),
  )

  .get("/product/get-all", asyncWrapper(product_controller.get_all))

  .get(
    "/product/get-details/:id",
    asyncWrapper(product_controller.get_product_details),
  )

  .patch(
    "/product/update/:id",
    verifyToken(config.VENDOR),
    asyncWrapper(product_controller.update),
  )

  .delete(
    "/product/delete/:id",
    verifyToken(config.VENDOR),
    asyncWrapper(product_controller.delete_product),
  )

  .patch(
    "/product/approve/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(product_controller.approve_product),
  )

  .patch(
    "/product/feature/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(product_controller.feature_product),
  );
