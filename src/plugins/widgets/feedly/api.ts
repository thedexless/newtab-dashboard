import { API } from "../../types";
import { Article, Cache } from "./types";

const API_BASE = "https://api.feedly.com/v3";

/**
 * Fetch the latest articles from a Feedly stream.
 *
 * Returns the Leo-affected stream (priorities/mute filters/dedup are applied
 * server-side by Feedly, so this is the AI-curated result, not raw RSS).
 */
export async function getArticles(
  { token, streamId, count }: { token?: string; streamId: string; count: number },
  loader: API["loader"],
): Promise<Cache> {
  if (!token) return undefined;

  loader.push();
  try {
    const url = `${API_BASE}/streams/contents?streamId=${encodeURIComponent(
      streamId,
    )}&count=${count}&ranked=engagement`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Feedly API ${res.status}`);
    }
    const body = await res.json();

    const articles: Article[] = (body.items ?? []).map((item: any) => ({
      id: item.id,
      title: item.title || "(no title)",
      url: item.alternate?.[0]?.href || item.canonicalUrl,
      published: item.published ? item.published * 1000 : undefined,
      unread: item.unread,
      source: item.origin
        ? { title: item.origin.title, iconUrl: item.origin.iconUrl }
        : undefined,
    }));

    return {
      timestamp: Date.now(),
      updated: body.updated ?? 0,
      articles,
    };
  } finally {
    loader.pop();
  }
}