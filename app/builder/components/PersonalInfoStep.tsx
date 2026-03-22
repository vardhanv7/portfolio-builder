"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePortfolioStore } from "@/lib/store";

const personalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(1, "Professional title is required"),
  bio: z.string().max(500, "Bio must be 500 characters or fewer"),
  email: z.string().email("Enter a valid email address"),
  location: z.string().optional(),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

export default function PersonalInfoStep() {
  const { portfolioData, updatePersonal, updateContact } = usePortfolioStore();

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      email: "",
      location: "",
    },
  });

  // Pre-populate from store on mount
  useEffect(() => {
    reset({
      name: portfolioData.personal.name,
      title: portfolioData.personal.title,
      bio: portfolioData.personal.bio,
      email: portfolioData.contact.email,
      location: portfolioData.contact.location ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync valid form values → store
  const values = watch();
  useEffect(() => {
    const result = personalSchema.safeParse(values);
    if (!result.success) return;
    updatePersonal({
      name: result.data.name,
      title: result.data.title,
      bio: result.data.bio,
    });
    updateContact({
      email: result.data.email,
      location: result.data.location || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const bioLength = watch("bio")?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about yourself. This appears at the top of your portfolio.
        </p>
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Jane Smith"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Professional Title */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">
          Professional Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Full Stack Developer"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="bio">Bio</Label>
          <span className="text-xs text-muted-foreground">{bioLength}/500</span>
        </div>
        <Textarea
          id="bio"
          placeholder="Tell visitors about yourself, your background, and what you're passionate about…"
          className="resize-none h-32"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-xs text-destructive">{errors.bio.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="San Francisco, CA"
          {...register("location")}
        />
      </div>
    </div>
  );
}
