import { z } from 'zod';

export const addItemSchema = z.object({
  body: z.object({
    category: z.string({ message: "Category is required" }), // <-- Updated for Zod v4
    imageUrl: z.string().url("Must be a valid image URL"),
    colorHex: z.string().optional(),
  })
});