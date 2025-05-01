import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import { overview_controller } from "./overview_controller";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";

export const overview_router = express.Router();

overview_router.get(
  "/dashboard/get-overview",
  verifyToken(config.ADMIN),
  asyncWrapper(overview_controller.get_overview),
);
