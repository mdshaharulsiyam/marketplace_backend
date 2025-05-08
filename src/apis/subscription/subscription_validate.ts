import { z } from "zod";

const create_validation = z.object({
  body: z.object({
    subscription_id: z.string({
      required_error: "subscription id is required",
    }),
  }),
  cookies: z.string({ required_error: "unauthorize access" }),
});
export const subscription_validate = Object.freeze({
  create_validation,
});
