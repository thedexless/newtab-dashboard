import { Data, Image } from "./types";

export const officialCollection = 1053828;

type Config = Pick<
  Data,
  "by" | "collections" | "featured" | "search" | "topics"
>;

export const fetchImages = async ({
  by,
  collections,
  topics,
  featured,
  search,
}: Config): Promise<Image[]> => {
  const url = "https://api.unsplash.com/photos/random";
  const params = new URLSearchParams();
  const headers = new Headers({
    Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
  });

  params.set("count", "10");

  const applyParams: Record<Config["by"], () => void> = {
    collections: () => params.set("collections", collections),
    topics: () => {
      params.set("topics", topics);
      params.set("orientation", "landscape");
    },
    search: () => {
      params.set("orientation", "landscape");
      if (featured) params.set("featured", "true");
      if (search) params.set("query", search);
    },
    official: () => params.set("collections", String(officialCollection)),
  };
  applyParams[by]();

  const res = await fetch(`${url}?${params}`, { headers, cache: "no-cache" });
  const body = await res.json();

  // TODO: validate types

  return body.map((item: any) => ({
    src: item.urls.raw,
    credit: {
      imageLink: item.links.html,
      location: item.location ? item.location.name : null,
      userName: item.user.name,
      userLink: item.user.links.html,
    },
  }));
};

/**
 * Build image link from raw
 * TODO: allow quality to be adjustable, possibly in combination with size
 */
export const buildLink = (src: string): string => {
  const url = new URL(src);
  url.searchParams.set("q", "85");
  url.searchParams.set(
    "w",
    String(calculateWidth(window.innerWidth, window.devicePixelRatio)),
  );
  return String(url);
};

/**
 * Calculate width to fetch image, tuned for Unsplash cache performance.
 */
export function calculateWidth(screenWidth = 1920, pixelRatio = 1): number {
  return Math.ceil(
    Math.min(Math.max(screenWidth * pixelRatio, 1920), 3840) / 240,
  ) * 240;
}
