import { z } from "zod";

const envSchema = z
  .object({ DATABASE_URL: z.string().min(1), SECRET: z.string().min(1) })
  .required();

export const env = envSchema.parse(process.env);
