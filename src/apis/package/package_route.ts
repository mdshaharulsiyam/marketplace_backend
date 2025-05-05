import express from "express";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import uploadFile from "../../middleware/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import verifyToken from "../../middleware/verifyToken";
import { package_controller } from "./package_controller";
import { package_validate } from "./package_validate";

export const package_router = express.Router();

package_router
  .post(
    "/package/create",
    validateRequest(package_validate.create_validation),
    verifyToken(config.ADMIN),
    asyncWrapper(package_controller.create),
  )

  .get("/package/get-all", asyncWrapper(package_controller.get_all))

  .patch(
    "/package/update/:id",
    verifyToken(config.ADMIN),
    uploadFile(),
    asyncWrapper(package_controller.update),
  )

  .delete(
    "/package/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(package_controller.delete_package),
  );
