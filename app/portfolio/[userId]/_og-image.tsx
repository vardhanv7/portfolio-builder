import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

const THEMES = {
  modern: {
    background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
    nameColor: "#ffffff",
    titleColor: "rgba(255,255,255,0.70)",
    badgeBg: "#3f3f46",
    badgeColor: "#e4e4e7",
    creditColor: "rgba(255,255,255,0.38)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  minimal: {
    background: "linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)",
    nameColor: "#18181b",
    titleColor: "#52525b",
    badgeBg: "#e4e4e7",
    badgeColor: "#3f3f46",
    creditColor: "rgba(0,0,0,0.32)",
    borderColor: "#d4d4d8",
  },
  creative: {
    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
    nameColor: "#ffffff",
    titleColor: "rgba(255,255,255,0.85)",
    badgeBg: "rgba(255,255,255,0.18)",
    badgeColor: "#ffffff",
    creditColor: "rgba(255,255,255,0.48)",
    borderColor: "rgba(255,255,255,0.40)",
  },
} as const;

type TemplateName = keyof typeof THEMES;

export async function generateOGImage(userId: string): Promise<ImageResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("personal, skills, template_name, avatar_url")
    .eq("user_id", userId)
    .eq("is_published", true)
    .single();

  const personal = (portfolio?.personal as { name?: string; title?: string } | null) ?? null;
  const name = personal?.name ?? "Portfolio";
  const title = personal?.title ?? "";
  const skills = ((portfolio?.skills as { name: string }[] | null) ?? []).slice(0, 5);
  const templateName = ((portfolio?.template_name as string) ?? "modern") as TemplateName;
  const avatarUrl = (portfolio?.avatar_url as string | null) ?? null;

  const theme = THEMES[templateName] ?? THEMES.modern;
  const hasAvatar = !!avatarUrl;
  const nameFontSize = hasAvatar ? 54 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: theme.background,
          position: "relative",
        }}
      >
        {/* Avatar */}
        {hasAvatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl!}
            width={112}
            height={112}
            alt=""
            style={{
              borderRadius: "9999px",
              border: `4px solid ${theme.borderColor}`,
              marginBottom: "22px",
            }}
          />
        )}

        {/* Name */}
        <div
          style={{
            display: "flex",
            fontSize: nameFontSize,
            fontWeight: 700,
            color: theme.nameColor,
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "10px",
            maxWidth: "1000px",
          }}
        >
          {name}
        </div>

        {/* Title */}
        {title ? (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: theme.titleColor,
              textAlign: "center",
              marginBottom: "34px",
              maxWidth: "800px",
            }}
          >
            {title}
          </div>
        ) : null}

        {/* Skill badges */}
        {skills.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
              maxWidth: "900px",
            }}
          >
            {skills.map((skill) => (
              <div
                key={skill.name}
                style={{
                  display: "flex",
                  background: theme.badgeBg,
                  color: theme.badgeColor,
                  padding: "7px 20px",
                  borderRadius: "9999px",
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                {skill.name}
              </div>
            ))}
          </div>
        ) : null}

        {/* Credit */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "24px",
            right: "36px",
            fontSize: 15,
            color: theme.creditColor,
          }}
        >
          Built with PortfolioBuilder
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
