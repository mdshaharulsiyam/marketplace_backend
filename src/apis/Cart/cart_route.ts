import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import { cart_controller } from "./cart_controller";
import validateRequest from "../../middleware/validateRequest";
import { cart_validate } from "./cart_validate";

export const cart_router = express.Router();

cart_router
  .post(
    "/cart/create",
    validateRequest(cart_validate.create_validate),
    verifyToken(config.USER),
    asyncWrapper(cart_controller.create_or_update),
  )

  .get(
    "/cart/get-all",
    verifyToken(config.USER),
    asyncWrapper(cart_controller.get_all),
  )

  .delete(
    "/cart/delete/:id",
    verifyToken(config.USER),
    asyncWrapper(cart_controller.delete_cart),
  )

  .patch(
    "/cart/delete-item/:id",
    verifyToken(config.USER),
    asyncWrapper(cart_controller.delete_cart_item),
  );

// .patch('/cart/update/:id',
//     verifyToken(config.USER),
//     asyncWrapper(cart_controller.update)
// )
