import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import config from "../DefaultConfig/config";
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10000, //limit: 100,
  handler: (req, res) => {
    // console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).send({ success: false, message: "Too many requests" });
  },
});
// const loginLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 5,
//     message: "Too many login attempts. Please try again later.",
// });
const middleware = (app: Express) => {
  // body parser
  // app.use(urlencoded({ extended: true }))
  app.use(express.json());
  // cookie parser
  app.use(cookieParser());
  app.use(limiter);
  // cors setup
  app.use(
    cors({
      // origin: (origin, callback) => {
      //     console.log(config?.ALLOWED_ORIGIN,origin)
      //     config?.ALLOWED_ORIGIN?.includes(origin || "") ? callback(null, true) : callback(new Error('origin not allowed'))
      // },
      origin: [...config?.ALLOWED_ORIGIN, "http://3.138.222.235:4173/", "http://3.138.222.235:4173", "http://10.0.60.25:3000", "http://localhost:3000", "http://10.0.60.189:3000"],
      optionsSuccessStatus: 200,
      credentials: true,
    }),
  );
};
export default middleware;
