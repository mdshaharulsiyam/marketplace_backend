import express from "express";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import { city_controller } from "./city_controller";

export const city_router = express.Router();

city_router
  .post(
    "/city/create",
    verifyToken(config.ADMIN),
    asyncWrapper(city_controller.create),
  )

  .get("/city/get-all", asyncWrapper(city_controller.get_all))

  .patch(
    "/city/update/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(city_controller.update),
  )

  .delete(
    "/city/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(city_controller.delete_city),
  );
