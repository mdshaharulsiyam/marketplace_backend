import { z } from "zod";

const create_validation = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    price: z.number({
      required_error: "price is required",
      invalid_type_error: "price should be a number"
    }),
    features: z.array(z.string({
      required_error: 'features is required'
    })).min(1, "features is required"),
    type: z.string({ required_error: "type is required" }).optional()
  }),
  cookies: z.string({
    required_error: "unauthorized error"
  })
})
export const package_validate = Object.freeze({
  create_validation
})