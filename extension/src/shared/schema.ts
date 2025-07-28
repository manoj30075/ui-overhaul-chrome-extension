// Zod schema for patch JSON
import { z } from 'zod';

export const patchSchema = z.array(z.object({
  type: z.enum(['hide', 'css', 'replace', 'insert']),
  selector: z.string(),
  content: z.optional(z.string()),
  properties: z.optional(z.record(z.string(), z.string()))
}));

// Schema for menu actions
export const menuActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.optional(z.string()),
  context: z.optional(z.array(z.enum(['text', 'image', 'link', 'page', 'video', 'audio']))),
  enabled: z.optional(z.boolean()).default(true)
});

export const contextMenuConfigSchema = z.object({
  actions: z.array(menuActionSchema),
  theme: z.optional(z.enum(['light', 'dark', 'auto'])).default('light'),
  position: z.optional(z.enum(['cursor', 'element'])).default('cursor'),
  showIcons: z.optional(z.boolean()).default(true),
  maxItems: z.optional(z.number()).default(10)
});

// Type exports
export type MenuAction = z.infer<typeof menuActionSchema>;
export type ContextMenuConfig = z.infer<typeof contextMenuConfigSchema>;
export type PatchAction = z.infer<typeof patchSchema>[0];
