import { z } from 'zod';

const create_validate = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Product Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.string({ required_error: "price is required" }),
    img: z.array(z.string()).max(6, { message: "A maximum of 6 images are allowed" })
      .refine((value) => value.length <= 6, { message: "A maximum of 6 images are allowed." }),
    category: z.string({ required_error: "category is required" }),
    sub_category: z.string({ required_error: "sub category is required" }),
    condition: z.enum(["USED", "NEW"], { message: "Product condition is required" }),
  }),
  cookies: z.string({ required_error: "unauthorized access" })
})

export const product_validate = Object.freeze({
  create_validate
})