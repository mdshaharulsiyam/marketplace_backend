import express, { NextFunction, Request, Response } from "express";
import os from 'os';
import path from "path";
import { payment_controller } from "./apis/Payment/payment_controller";
import { connectToDB } from "./db";
import config from "./DefaultConfig/config";
import asyncWrapper from "./middleware/asyncWrapper";
import middleware from "./middleware/middleware";
import { routeMiddleware } from "./middleware/routeMiddleware";
import { app, server } from "./socket";
import globalErrorHandler, { CustomError } from "./utils/globalErrorHandler";
import { logger } from "./utils/logger";

const numCPUs = os.cpus().length || 1;

// if (cluster.isPrimary) {
//   console.log(`primary process ${process.pid} running`)
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} exited. Restarting...`);
//     cluster.fork();
//   });
// } else {
app.post(
  "/payment/complete",
  express.raw({ type: "application/json" }),
  asyncWrapper(payment_controller.webhook),
);

app.get("/subscription/show", (req: Request, res: Response) => {
  res.status(200).send({ success: true, show: false });
})

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
  res.render("default");
});

middleware(app);
// route middleware
routeMiddleware(app);

app.use(globalErrorHandler);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404,
  );
  globalErrorHandler(error, req, res, next);
});
function main() {
  try {
    // server.listen(Number(config?.PORT), async () => {
    server.listen(Number(5000), async () => {
      logger.info("server is running");
      await connectToDB();
      logger.info(
        `Worker process ${process.pid} is running on port http://${config.IP}:${config.PORT}`,
      );

      // Error handling for worker processes
      process.on("uncaughtException", (error) => {
        console.error("Uncaught Exception:", error.message);
        console.error(error.stack);
      });

      process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
      });

      process.on("SIGTERM", () => {
        console.log(
          `Worker process ${process.pid} received SIGTERM. Shutting down gracefully.`,
        );
        process.exit(0);
      });

      process.on("SIGINT", () => {
        console.log(
          `Worker process ${process.pid} received SIGINT. Shutting down gracefully.`,
        );
        //   process.exit(0);
      });
    });
  } catch (error) {
    console.log(error);
    // logger.error(error)
  }
}

main();
// }
