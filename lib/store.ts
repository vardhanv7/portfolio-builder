import { create } from "zustand";
import type { PortfolioData } from "@/types/portfolio";

type Skill = PortfolioData["skills"][0];
type Project = PortfolioData["projects"][0];
type Experience = PortfolioData["experience"][0];
type Education = PortfolioData["education"][0];

interface PortfolioStore {
  portfolioData: PortfolioData;
  currentStep: 1 | 2 | 3 | 4;
  selectedTemplate: "modern" | "minimal" | "creative";
  isLoading: boolean;
  isSaved: boolean;

  updatePersonal: (personal: Partial<PortfolioData["personal"]>) => void;
  updateSkills: (skills: PortfolioData["skills"]) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (index: number) => void;
  addProject: (project: Project) => void;
  removeProject: (index: number) => void;
  updateProject: (index: number, project: Partial<Project>) => void;
  addExperience: (exp: Experience) => void;
  removeExperience: (index: number) => void;
  addEducation: (edu: Education) => void;
  removeEducation: (index: number) => void;
  updateSocial: (social: Partial<PortfolioData["social"]>) => void;
  updateContact: (contact: Partial<PortfolioData["contact"]>) => void;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setTemplate: (template: "modern" | "minimal" | "creative") => void;
  setFullData: (data: Partial<PortfolioData>) => void;
  setIsLoading: (v: boolean) => void;
  setIsSaved: (v: boolean) => void;
}

const initialPortfolioData: PortfolioData = {
  personal: { name: "", title: "", bio: "" },
  skills: [],
  projects: [],
  experience: [],
  education: [],
  social: {},
  contact: { email: "" },
};

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolioData: initialPortfolioData,
  currentStep: 1,
  selectedTemplate: "modern",
  isLoading: false,
  isSaved: false,

  updatePersonal: (personal) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        personal: { ...state.portfolioData.personal, ...personal },
      },
    })),

  updateSkills: (skills) =>
    set((state) => ({ portfolioData: { ...state.portfolioData, skills } })),

  addSkill: (skill) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        skills: [...state.portfolioData.skills, skill],
      },
    })),

  removeSkill: (index) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        skills: state.portfolioData.skills.filter((_, i) => i !== index),
      },
    })),

  addProject: (project) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        projects: [...state.portfolioData.projects, project],
      },
    })),

  removeProject: (index) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        projects: state.portfolioData.projects.filter((_, i) => i !== index),
      },
    })),

  updateProject: (index, partial) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        projects: state.portfolioData.projects.map((p, i) =>
          i === index ? { ...p, ...partial } : p
        ),
      },
    })),

  addExperience: (exp) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        experience: [...state.portfolioData.experience, exp],
      },
    })),

  removeExperience: (index) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        experience: state.portfolioData.experience.filter((_, i) => i !== index),
      },
    })),

  addEducation: (edu) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        education: [...state.portfolioData.education, edu],
      },
    })),

  removeEducation: (index) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        education: state.portfolioData.education.filter((_, i) => i !== index),
      },
    })),

  updateSocial: (social) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        social: { ...state.portfolioData.social, ...social },
      },
    })),

  updateContact: (contact) =>
    set((state) => ({
      portfolioData: {
        ...state.portfolioData,
        contact: { ...state.portfolioData.contact, ...contact },
      },
    })),

  setStep: (step) => set({ currentStep: step }),

  setTemplate: (template) => set({ selectedTemplate: template }),

  setFullData: (data) =>
    set((state) => ({
      portfolioData: {
        personal: { ...state.portfolioData.personal, ...(data.personal ?? {}) },
        skills: data.skills ?? state.portfolioData.skills,
        projects: data.projects ?? state.portfolioData.projects,
        experience: data.experience ?? state.portfolioData.experience,
        education: data.education ?? state.portfolioData.education,
        social: { ...state.portfolioData.social, ...(data.social ?? {}) },
        contact: { ...state.portfolioData.contact, ...(data.contact ?? {}) },
      },
    })),

  setIsLoading: (v) => set({ isLoading: v }),
  setIsSaved: (v) => set({ isSaved: v }),
}));
