import { z } from 'zod';

export const AuthResponseZ = z.object({
  token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseZ>;
