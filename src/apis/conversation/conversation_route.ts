import express from "express";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import uploadFile from "../../middleware/fileUploader";
import verifyToken from "../../middleware/verifyToken";
import { conversation_controller } from "./conversation_controller";

export const conversation_router = express.Router();

conversation_router
  .post(
    "/conversation/create",
    verifyToken(config.USER),
    asyncWrapper(conversation_controller.create),
  )

  .get(
    "/conversation/get-all",
    verifyToken(config.USER),
    asyncWrapper(conversation_controller.get_all),
  )

  .patch(
    "/conversation/update/:id",
    verifyToken(config.USER),
    uploadFile(),
    asyncWrapper(conversation_controller.update),
  )
  .patch(
    "/conversation/block/:id",
    verifyToken(config.USER),
    asyncWrapper(conversation_controller.block_user),
  )
  .delete(
    "/conversation/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(conversation_controller.delete_conversation),
  );
