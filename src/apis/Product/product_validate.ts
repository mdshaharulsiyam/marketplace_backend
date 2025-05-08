import { z } from "zod";

const create_validate = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Product Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.string({ required_error: "price is required" }),
    img: z
      .array(z.string({ required_error: "image is required" }))
      .max(6, { message: "A maximum of 6 images are allowed" })
      .refine((value) => value.length <= 6, {
        message: "A maximum of 6 images are allowed.",
      }),
    category: z.string({ required_error: "category is required" }),
    sub_category: z.string({ required_error: "sub category is required" }),
    condition: z.enum(["USED", "NEW"], {
      message: "Product condition is required",
    }),
  }),
  cookies: z.string({ required_error: "unauthorized access" }),
});

const update_validate = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Product Name is required" }).optional(),
    description: z
      .string()
      .min(1, { message: "Description is required" })
      .optional(),
    price: z.string({ required_error: "price is required" }).optional(),
    img: z
      .union([
        z.string(),
        z
          .array(z.string())
          .max(6, { message: "A maximum of 6 images are allowed" }),
        z.null(),
      ])
      .optional(),
    category: z.string({ required_error: "category is required" }).optional(),
    sub_category: z
      .string({ required_error: "sub category is required" })
      .optional(),
    condition: z
      .enum(["USED", "NEW"], { message: "Product condition is required" })
      .optional(),
    retained_images: z.string().optional(),
    deleted_images: z.string().optional(),
  }),
  cookies: z.string({ required_error: "unauthorized access" }),
});

export const product_validate = Object.freeze({
  create_validate,
  update_validate,
});
