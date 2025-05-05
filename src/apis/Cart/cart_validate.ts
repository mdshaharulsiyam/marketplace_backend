import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const cartItemSchema = z.object({
  product_id: objectId,
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be a non-negative number"),
  _id: objectId.optional(),
});

export const create_validate = z.object({
  body: z.object({
    user: objectId,
    items: z.array(cartItemSchema).nonempty("Cart cannot be empty"),
    total_quantity: z.number().min(0, "Total quantity must be at least 0"),
    total_price: z.number().min(0, "Total price must be at least 0"),
  }),
  cookies: z.string({ required_error: "authentication token are missing" }),
});
export const cart_validate = Object.freeze({
  create_validate,
});
