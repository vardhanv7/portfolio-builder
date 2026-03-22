export { default as ModernTemplate } from "./modern/ModernTemplate";
export { default as MinimalTemplate } from "./minimal/MinimalTemplate";
export { default as CreativeTemplate } from "./creative/CreativeTemplate";

import type { TemplateConfig } from "./types";

export const templateRegistry: Record<string, TemplateConfig> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Dark, bold, and professional",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Light, clean, and editorial",
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Vibrant gradients with animations",
  },
};
