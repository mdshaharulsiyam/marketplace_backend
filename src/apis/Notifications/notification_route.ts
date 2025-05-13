import express from "express";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import { notification_controller } from "./notificatioin_controller";

export const notification_router = express.Router();

notification_router
  .get(
    "/notification/get-all",
    verifyToken(config.USER),
    asyncWrapper(notification_controller.get_all),
  )
  .delete('/notification/delete/:id',
     verifyToken(config.USER),
      asyncWrapper(notification_controller.delete_notification)
    )
    
  .patch(
    "/notification/read/:id",
    verifyToken(config.USER),
    asyncWrapper(notification_controller.read),
  );
