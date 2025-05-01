import { z } from "zod";

const create_validate = z.object({
  body: z.object({
    img: z
      .array(
        z.string({
          required_error: "Each image must be a string",
          invalid_type_error: "banner image should be a link string",
        }),
      )
      .min(1, "banner image is required")
      .max(1, "maximum 1 image can be uploaded at a time"),
    link: z.string({ invalid_type_error: "link should be string" }).optional(),
    is_active: z
      .boolean({ invalid_type_error: "invalid type for is_active" })
      .optional(),
    emoji: z
      .string({ invalid_type_error: "emoji should be string" })
      .optional(),
    start_date: z.date({
      invalid_type_error: "start_date should be date",
      required_error: "start_date is required",
    }),
    end_date: z.date({
      invalid_type_error: "end_date should be date",
      required_error: "end_date is required",
    }),
  }),
  cookies: z.string({ required_error: "authentication token are missing" }),
});

const update_validate = z.object({
  body: z.object({
    img: z
      .array(
        z.string({
          invalid_type_error: "banner image should be a link string",
        }),
      )
      .min(1, "banner image is required")
      .max(1, "maximum 1 image can be uploaded at a time")
      .optional(),
    link: z.string({ invalid_type_error: "link should be string" }).optional(),
    is_active: z
      .boolean({ invalid_type_error: "invalid type for is_active" })
      .optional(),
    emoji: z
      .string({ invalid_type_error: "emoji should be string" })
      .optional(),
    start_date: z
      .date({
        invalid_type_error: "start_date should be date",
        required_error: "start_date is required",
      })
      .optional(),
    end_date: z
      .date({
        invalid_type_error: "end_date should be date",
        required_error: "end_date is required",
      })
      .optional(),
  }),
  cookies: z.string({ required_error: "authentication token are missing" }),
});

export const banner_validate = Object.freeze({
  create_validate,
  update_validate,
});
