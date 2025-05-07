import express, { Request } from "express";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import uploadFile from "../../middleware/fileUploader";
import verifyToken from "../../middleware/verifyToken";
import { package_model } from '../package/package_model';
import { subscription_controller } from "./subscription_controller";

export const subscription_router = express.Router();

subscription_router
  .post(
    "/subscription/create",
    verifyToken(config.USER, undefined, undefined, async (req: Request) => {
      const packages = await package_model.findById(
        req.body.subscription_id,
      );
      return { packages };
    }),
    asyncWrapper(subscription_controller.create),
  )

  .get("/subscription/get-all", verifyToken(config.ADMIN), asyncWrapper(subscription_controller.get_all))
  .get("/subscription/get-my-subscription", verifyToken(config.USER), asyncWrapper(subscription_controller.get_my_subscription))

  .patch(
    "/subscription/update/:id",
    verifyToken(config.ADMIN),
    uploadFile(),
    asyncWrapper(subscription_controller.update),
  )

  .delete(
    "/subscription/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(subscription_controller.delete_subscription),
  );
