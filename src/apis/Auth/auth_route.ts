import express from "express";
import rateLimit from "express-rate-limit";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import uploadFile from "../../middleware/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import verifyToken from "../../middleware/verifyToken";
import { auth_controller } from "./auth_controller";
import { auth_validate } from "./auth_validate";
export const auth_router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 4,
  handler: (req, res) => {
    // console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).send({
      success: false,
      message: "Too many requests please try after 1 hour",
    });
  },
});

auth_router
  .post(
    "/auth/sign-up",
    validateRequest(auth_validate.sign_up_validation),
    verifyToken(config.USER, false),
    asyncWrapper(auth_controller.create),
  )

  .post(
    "/auth/sign-in",
    // loginLimiter,
    validateRequest(auth_validate.login_validation),
    asyncWrapper(auth_controller.sing_in),
  )

  .post(
    "/auth/reset-password",
    validateRequest(auth_validate.reset_password_validate),
    verifyToken(config.USER, true, config.ACCESS_TOKEN_NAME),
    asyncWrapper(auth_controller.reset_password),
  )

  .post(
    "/auth/change-password",
    validateRequest(auth_validate.change_password_validate),
    verifyToken(config.USER),
    asyncWrapper(auth_controller.change_password),
  )

  .patch(
    "/auth/update-profile",
    uploadFile(),
    validateRequest(auth_validate.update_auth_validation),
    verifyToken(config.USER),
    asyncWrapper(auth_controller.update_auth),
  )

  .get(
    "/auth/profile",
    uploadFile(),
    verifyToken(config.USER),
    asyncWrapper(auth_controller.get_profile),
  )

  .post("/auth/logout", asyncWrapper(auth_controller.sing_out))

  .patch(
    "/auth/verify-identity/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(auth_controller.verify_identity),
  )

  .patch(
    "/auth/block/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(auth_controller.block_auth),
  )
  .get(
    "/auth/get-all",
    verifyToken(config.ADMIN),
    asyncWrapper(auth_controller.get_all),
  )
  .get("/auth/details/:id", asyncWrapper(auth_controller.get_details));
// , undefined, undefined, async (req: Request) => {
//   const [category, banner] = await Promise.all([
//     category_model.find(),
//     banner_model.find()
//   ])
//   return { category, banner }
// }
