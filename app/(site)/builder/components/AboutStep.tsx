"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserCircle2, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { usePortfolioStore } from "@/lib/store";
import { toast } from "sonner";

const aboutSchema = z.object({
  tagline: z.string().max(150, "Tagline must be 150 characters or fewer"),
  bio: z.string().max(1000, "Bio must be 1000 characters or fewer"),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AboutStep() {
  const { portfolioData, updatePersonal, avatarUrl, setAvatarUrl } =
    usePortfolioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    mode: "onChange",
    defaultValues: { tagline: "", bio: "" },
  });

  useEffect(() => {
    reset({
      tagline: portfolioData.personal.tagline ?? "",
      bio: portfolioData.personal.bio,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taglineVal = watch("tagline");
  const bioVal = watch("bio");

  useEffect(() => {
    const result = aboutSchema.safeParse({ tagline: taglineVal, bio: bioVal });
    if (!result.success) return;
    updatePersonal({ tagline: result.data.tagline, bio: result.data.bio });
  }, [taglineVal, bioVal, updatePersonal]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      // Bust cache with a timestamp so the new image shows immediately
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(publicUrl);
      toast.success("Photo uploaded");
    } catch (err) {
      console.error("[AboutStep] upload error", err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemovePhoto() {
    setAvatarUrl(null);
  }

  const taglineLength = taglineVal?.length ?? 0;
  const bioLength = bioVal?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">About &amp; Photo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add a profile photo and write a short bio for your portfolio.
        </p>
      </div>

      {/* ── Photo upload ─────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-border bg-muted flex items-center justify-center">
          {uploading ? (
            <Loader2 className="size-8 text-muted-foreground animate-spin" />
          ) : avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Profile photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle2 className="size-16 text-muted-foreground" />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload Photo"}
          </Button>
          {avatarUrl && !uploading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemovePhoto}
            >
              <X className="size-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or WebP · max 5 MB
        </p>
      </div>

      {/* ── Short Tagline ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="tagline">Short Tagline</Label>
          <span className="text-xs text-muted-foreground">
            {taglineLength}/150
          </span>
        </div>
        <Input
          id="tagline"
          placeholder="Building elegant solutions to complex problems"
          {...register("tagline")}
        />
        {errors.tagline && (
          <p className="text-xs text-destructive">{errors.tagline.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Displayed in the hero/home section of your portfolio.
        </p>
      </div>

      {/* ── About Me ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="bio">About Me</Label>
          <span className="text-xs text-muted-foreground">
            {bioLength}/1000
          </span>
        </div>
        <Textarea
          id="bio"
          placeholder="Tell visitors about your background, what you're passionate about, and what drives your work…"
          className="resize-none h-40"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-xs text-destructive">{errors.bio.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Displayed in the dedicated About section of your portfolio.
        </p>
      </div>
    </div>
  );
}
