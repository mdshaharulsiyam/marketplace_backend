import { z } from "zod";

const create_validation = z.object({
  body: z.object({
    product: z.string({
      required_error: "product is required",
    }),
  }),
  cookies: z.string({ required_error: "unauthorize access" })
})
export const favorite_validate = Object.freeze({
  create_validation
})