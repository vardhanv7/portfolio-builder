export type ThemeConfig = {
  mode: "single" | "combination";
  primary: string;
  secondary: string;
  preset: string | null;
};

export interface PortfolioData {
  avatar_url?: string;
  personal: {
    name: string;
    title: string;
    tagline?: string;
    bio: string;
    avatar?: string;
  };
  skills: {
    name: string;
    category?: string;
    level?: number;
  }[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
    url?: string;
    githubUrl?: string;
    image?: string;
  }[];
  experience: {
    company: string;
    role: string;
    period: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  contact: {
    email: string;
    location?: string;
  };
  theme?: ThemeConfig;
  sectionOrder: string[];
}
