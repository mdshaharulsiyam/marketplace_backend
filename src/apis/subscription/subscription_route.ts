import express, { Request } from "express";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import uploadFile from "../../middleware/fileUploader";
import verifyToken from "../../middleware/verifyToken";
import { subscription_controller } from "./subscription_controller";
import { subscription_model } from "./subscription_model";

export const subscription_router = express.Router();

subscription_router
  .post(
    "/subscription/create",
    verifyToken(config.USER, undefined, undefined, async (req: Request) => {
      const subscription = await subscription_model.findById(
        req.body.subscription_id,
      );
      return { subscription };
    }),
    asyncWrapper(subscription_controller.create),
  )

  .get("/subscription/get-all", asyncWrapper(subscription_controller.get_all))

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
