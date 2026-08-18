import { API } from "../../types";

/** A single article from the Feedly stream */
export type Article = {
  id: string;
  title: string;
  url?: string;
  /** published/unread timestamps in ms */
  published?: number;
  unread?: boolean;
  source?: { title?: string; iconUrl?: string };
};

/** Configuration stored in the widget data */
export type Data = {
  /** Feedly developer access token (https://feedly.com/v3/auth/dev) */
  token?: string;
  /** Feedly streamId to fetch, e.g. user/<id>/category/global.all */
  streamId: string;
  /** How many articles to show */
  count: number;
};

/** Cached fetch result */
export type Cache =
  | {
      timestamp: number;
      updated: number;
      articles: Article[];
    }
  | undefined;

export type Props = API<Data, Cache>;

export const defaultData: Data = {
  streamId: "user/me/category/global.all",
  count: 10,
};