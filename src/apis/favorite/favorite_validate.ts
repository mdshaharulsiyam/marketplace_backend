import { z } from "zod";

const create_validation = z.object({
  cookies: z.string({ required_error: "unauthorize access" })
})
export const favorite_validate = Object.freeze({
  create_validation
})