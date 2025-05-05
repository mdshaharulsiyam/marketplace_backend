import express, { Express, Request, Response } from "express";
import path from "path";
import { auth_router } from "../apis/Auth/auth_route";
import { banner_router } from "../apis/Banner/banner_route";
import { category_router } from "../apis/Category/category_route";
import { city_router } from "../apis/city/city_route";
import { division_router } from "../apis/division/division_route";
import { faq_router } from "../apis/faq/faq_route";
import { favorite_router } from "../apis/favorite/favorite_route";
import { notification_router } from "../apis/Notifications/notification_route";
import { overview_router } from "../apis/Overview/overview_route";
import { package_router } from "../apis/package/package_route";
import { payment_route } from "../apis/Payment/payment_route";
import { product_router } from "../apis/Product/product_route";
import { service_router } from "../apis/Service/service_route";
import { setting_router } from "../apis/Setting/setting_router";
import { verification_router } from "../apis/Verification/verification_route";
import { sendMail } from "../utils/sendMail";
import asyncWrapper from "./asyncWrapper";

export const routeMiddleware = (app: Express) => {
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

  app.post(
    "/send-email",
    asyncWrapper(async (req: Request, res: Response) => {
      const { receiver, name, question } = req.body;

      if (!receiver || !name || !question)
        throw new Error("All fields are required");

      const result = await sendMail.sendQuestionMail(receiver, name, question);
      console.log(result);
      res.status(200).send({
        success: true,
        message: "Contact Email sent successfully",
      });
    }),
  );

  app.use(auth_router);
  app.use(verification_router);
  app.use(category_router);
  app.use(service_router);
  app.use(notification_router);
  app.use(setting_router);
  app.use(overview_router);
  app.use(payment_route);
  app.use(banner_router);
  app.use(product_router);
  app.use(faq_router);
  app.use(division_router);
  app.use(city_router);
  app.use(package_router);
  app.use(favorite_router);
};
