import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Nominal harus berupa angka lebih besar dari 0."),
  category: z.string().trim().max(50).optional(),
  description: z.string().trim().max(200).optional(),
  transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid."),
});

export const filterSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(["income", "expense"]).optional(),
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});