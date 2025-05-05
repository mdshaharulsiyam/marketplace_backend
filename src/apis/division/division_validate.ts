import { z } from "zod";
const create_validation = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required",
    }),
  }),
  cookies: z.string({
    required_error: "unauthorized access",
  }),
});
export const division_validate = Object.freeze({
  create_validation,
});
