import { z } from 'zod';

export const envValidationSchema = z.object({
  // mode
  NODE_ENV: z.enum(['development', 'production']),

  // listen
  LISTEN_PORT: z.coerce.number().int().positive(),
  FRONTEND_ORIGIN: z.string().min(1).optional(),

  // database
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  // jwt
  JWT_SECRET: z.string().min(8),
  ACCESS_TOKEN_TTL: z.string().min(1),
  REFRESH_TOKEN_TTL: z.string().min(1),

  // seed user
  SEED_USER_USERNAME: z.string().min(1),
  SEED_USER_PASSWORD: z.string().min(1),
});

export type EnvVariables = z.infer<typeof envValidationSchema>;
