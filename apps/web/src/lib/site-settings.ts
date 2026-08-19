import { cache } from "react";

import { createPublicClient } from "./supabase/public";

export type HomeHeroSettings = {
  ctaHref: string;
  ctaLabel: string;
  subtitle: string;
  title: string;
};

export const defaultHomeHeroSettings: HomeHeroSettings = {
  ctaHref: "/catalog",
  ctaLabel: "Перейти до каталогу",
  subtitle:
    "Фруктові чипси та прикраси для коктейлів. Натуральні продукти для здорового харчування та гарної подачі.",
  title: "Ласкаво просимо до DreamShop",
};

function stringSetting(
  value: Record<string, unknown>,
  key: keyof HomeHeroSettings,
  fallback: string,
) {
  const candidate = value[key];
  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : fallback;
}

export function homeHeroSettingsFromValue(value: unknown): HomeHeroSettings {
  const record =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const ctaHref = stringSetting(
    record,
    "ctaHref",
    defaultHomeHeroSettings.ctaHref,
  );

  return {
    ctaHref:
      ctaHref.startsWith("/") && !ctaHref.startsWith("//")
        ? ctaHref
        : defaultHomeHeroSettings.ctaHref,
    ctaLabel: stringSetting(
      record,
      "ctaLabel",
      defaultHomeHeroSettings.ctaLabel,
    ),
    subtitle: stringSetting(
      record,
      "subtitle",
      defaultHomeHeroSettings.subtitle,
    ),
    title: stringSetting(record, "title", defaultHomeHeroSettings.title),
  };
}

export const getHomeHeroSettings = cache(async (): Promise<HomeHeroSettings> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "home.hero")
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load home hero settings.");
  }

  return homeHeroSettingsFromValue(data?.value);
});
