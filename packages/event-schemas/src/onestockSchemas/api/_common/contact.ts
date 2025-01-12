import { z } from 'zod';

export const ContactZ = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string().optional(),
});

export const CustomerZ = ContactZ.extend({
  external_id: z.string(),
  email: z.string(),
});

export const CoordinatesSchema = z.object({
  lon: z.number(),
  lat: z.number(),
});

const CountrySchema = z.object({
  code: z.string(),
});

export const AddressSchema = z.object({
  id: z.string(),
  city: z.string(),
  contact: ContactZ,
  coordinates: CoordinatesSchema.optional(),
  lines: z.array(z.string()),
  regions: z.object({
    country: CountrySchema,
  }),
  zip_code: z.string(),
});

export type Contact = z.infer<typeof ContactZ>;
export type Customer = z.infer<typeof CustomerZ>;
export type Address = z.infer<typeof AddressSchema>;
