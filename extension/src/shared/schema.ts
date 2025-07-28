// Zod schema for patch JSON
import { z } from 'zod';

export const patchSchema = z.array(z.object({
  type: z.enum(['hide', 'css', 'replace', 'insert']),
  selector: z.string(),
  content: z.optional(z.string()),
  properties: z.optional(z.record(z.string(), z.string()))
}));
