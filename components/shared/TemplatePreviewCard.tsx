import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TemplatePreviewCardProps {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export default function TemplatePreviewCard({
  name,
  description,
  selected,
  onSelect,
}: TemplatePreviewCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "relative cursor-pointer p-4 transition-all select-none",
        selected
          ? "ring-2 ring-primary border-primary"
          : "hover:border-muted-foreground/40"
      )}
    >
      {/* Selected checkmark */}
      {selected && (
        <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}

      <p className="font-semibold pr-6">{name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
