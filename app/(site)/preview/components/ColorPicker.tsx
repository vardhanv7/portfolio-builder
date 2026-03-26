"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { usePortfolioStore } from "@/lib/store";
import type { ThemeConfig } from "@/types/portfolio";

// ── Presets ──────────────────────────────────────────────────────────────────

const SINGLE_PRESETS: { name: string; primary: string }[] = [
  { name: "Ocean Blue", primary: "#3b82f6" },
  { name: "Forest Green", primary: "#10b981" },
  { name: "Royal Purple", primary: "#8b5cf6" },
  { name: "Sunset Orange", primary: "#f97316" },
  { name: "Rose Pink", primary: "#f43f5e" },
  { name: "Slate Gray", primary: "#64748b" },
  { name: "Golden Amber", primary: "#f59e0b" },
  { name: "Teal", primary: "#14b8a6" },
];

const COMBO_PRESETS: { name: string; primary: string; secondary: string }[] = [
  { name: "Ocean Depths", primary: "#3b82f6", secondary: "#06b6d4" },
  { name: "Purple Haze", primary: "#8b5cf6", secondary: "#ec4899" },
  { name: "Forest Dawn", primary: "#10b981", secondary: "#f59e0b" },
  { name: "Sunset Blaze", primary: "#f97316", secondary: "#ef4444" },
  { name: "Northern Lights", primary: "#6366f1", secondary: "#22d3ee" },
  { name: "Rose Gold", primary: "#f43f5e", secondary: "#f59e0b" },
  { name: "Midnight", primary: "#1e293b", secondary: "#3b82f6" },
  { name: "Lavender Dream", primary: "#a78bfa", secondary: "#f0abfc" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidHex(hex: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

function expandHex(hex: string) {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex.toLowerCase();
}

// ── Swatch grid ───────────────────────────────────────────────────────────────

function SingleSwatchGrid({
  active,
  onSelect,
}: {
  active: string | null;
  onSelect: (p: { name: string; primary: string }) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SINGLE_PRESETS.map((p) => {
        const isActive = active === p.name;
        return (
          <button
            key={p.name}
            type="button"
            onClick={() => onSelect(p)}
            className={`group relative flex flex-col overflow-hidden rounded-lg border-2 text-left transition-all ${
              isActive
                ? "border-foreground shadow-sm"
                : "border-transparent hover:border-border"
            }`}
          >
            {/* Color bar */}
            <div
              className="h-8 w-full"
              style={{ backgroundColor: p.primary }}
            />
            {/* Checkmark overlay */}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Check className="size-4 text-white drop-shadow" />
              </div>
            )}
            {/* Name */}
            <span className="px-1.5 py-1 text-[10px] leading-tight text-muted-foreground">
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ComboSwatchGrid({
  active,
  onSelect,
}: {
  active: string | null;
  onSelect: (p: { name: string; primary: string; secondary: string }) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {COMBO_PRESETS.map((p) => {
        const isActive = active === p.name;
        return (
          <button
            key={p.name}
            type="button"
            onClick={() => onSelect(p)}
            className={`group relative flex flex-col overflow-hidden rounded-lg border-2 text-left transition-all ${
              isActive
                ? "border-foreground shadow-sm"
                : "border-transparent hover:border-border"
            }`}
          >
            {/* Gradient bar */}
            <div
              className="h-8 w-full"
              style={{
                background: `linear-gradient(to right, ${p.primary}, ${p.secondary})`,
              }}
            />
            {/* Checkmark overlay */}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Check className="size-4 text-white drop-shadow" />
              </div>
            )}
            {/* Name */}
            <span className="px-1.5 py-1 text-[10px] leading-tight text-muted-foreground">
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Hex input ─────────────────────────────────────────────────────────────────

function HexInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [raw, setRaw] = useState(value);

  // Keep local input in sync when value changes from outside (e.g. preset click)
  if (expandHex(isValidHex(raw) ? raw : "#000000") !== value) {
    // Only sync when they differ (avoids overwriting while typing)
  }

  function handleColorInput(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value;
    setRaw(hex);
    onChange(hex);
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value;
    setRaw(hex);
    if (isValidHex(hex)) {
      onChange(expandHex(hex));
    }
  }

  function handleTextBlur() {
    if (!isValidHex(raw)) {
      setRaw(value); // reset to last valid
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={handleColorInput}
          className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
        />
        <input
          type="text"
          value={raw}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          maxLength={7}
          className="w-24 rounded-md border border-input bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ColorPicker() {
  const { theme, setTheme } = usePortfolioStore();

  const isSingle = theme.mode === "single";

  function setMode(mode: ThemeConfig["mode"]) {
    setTheme({
      ...theme,
      mode,
      // When switching to single, secondary mirrors primary
      secondary: mode === "single" ? theme.primary : theme.secondary,
    });
  }

  function applyPreset(name: string, primary: string, secondary?: string) {
    setTheme({
      mode: theme.mode,
      primary,
      secondary: secondary ?? primary,
      preset: name,
    });
  }

  function setPrimary(primary: string) {
    setTheme({
      ...theme,
      primary,
      secondary: isSingle ? primary : theme.secondary,
      preset: null,
    });
  }

  function setSecondary(secondary: string) {
    setTheme({ ...theme, secondary, preset: null });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Mode toggle ─────────────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-sm font-semibold">Color Mode</p>
        <div className="flex rounded-lg border border-border overflow-hidden w-fit">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              isSingle
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Single Color
          </button>
          <button
            type="button"
            onClick={() => setMode("combination")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              !isSingle
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Color Combination
          </button>
        </div>
      </div>

      {/* ── Preset swatches ─────────────────────────────────────────────── */}
      <div>
        <p className="mb-3 text-sm font-semibold">Presets</p>
        {isSingle ? (
          <SingleSwatchGrid
            active={theme.preset}
            onSelect={(p) => applyPreset(p.name, p.primary)}
          />
        ) : (
          <ComboSwatchGrid
            active={theme.preset}
            onSelect={(p) => applyPreset(p.name, p.primary, p.secondary)}
          />
        )}
      </div>

      {/* ── Custom colors ────────────────────────────────────────────────── */}
      <div>
        <p className="mb-3 text-sm font-semibold text-muted-foreground">
          Or pick your own
        </p>
        <div className="flex flex-wrap gap-4">
          <HexInput
            label={isSingle ? "Color" : "Primary"}
            value={theme.primary}
            onChange={setPrimary}
          />
          {!isSingle && (
            <HexInput
              label="Secondary"
              value={theme.secondary}
              onChange={setSecondary}
            />
          )}
        </div>
      </div>
    </div>
  );
}
