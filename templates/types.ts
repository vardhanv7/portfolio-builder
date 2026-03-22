import type { PortfolioData } from "@/types/portfolio";

export type { PortfolioData };

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}
