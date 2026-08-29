import { DB } from "../lib";
import { importStore } from "./action";
import { cache, db } from "./state";

/** Migrate extension data */
const migrateExtension = async (): Promise<void> => {
  const key = "persist:data";
  const stored = await browser.storage.sync.get(key);
  if (stored[key]) {
    migrateIfEmpty(stored[key]);
    await browser.storage.sync.remove(key);
  }
};

/** Migrate web data */
const migrateWeb = async (): Promise<void> => {
  const key = "tabliss/data/persist:data";
  const data = localStorage.getItem(key);
  if (data) {
    try {
      migrateIfEmpty(JSON.parse(data));
    } catch {}
    localStorage.removeItem(key);
  }
};

/** Migrate legacy data into the new database if it is empty. */
const migrateIfEmpty = (dump: unknown): void => {
  if (db.cache.size !== 0) return;
  importStore(dump);
  migrateCache();
  clearDangling();
};

/** Check and migrate data */
export const migrate = BUILD_TARGET === "web" ? migrateWeb : migrateExtension;

/** Migrate cache data */
const migrateCache = (): void => {
  const open = indexedDB.open("tabliss", 3);
  open.onerror = console.error;
  open.onsuccess = () => {
    const read = open.result
      .transaction("cache")
      .objectStore("cache")
      .get("persist:cache");
    read.onerror = console.error;
    read.onsuccess = () => {
      const data: Record<string, unknown> = read.result;
      const used = findUsedIds();
      for (const id of used) {
        if (id in data) DB.put(cache, id, data[id]);
      }
      // For unexplained reasons this needs to be in a timeout
      setTimeout(() => {
        open.result.close();
        indexedDB.deleteDatabase("tabliss");
      });
    };
  };
};

/** Find all used plugin IDs in the database */
const findUsedIds = (): Set<string> => {
  const used = new Set<string>();
  used.add(DB.get(db, "background").id);
  for (const [, val] of DB.prefix(db, "widget/")) {
    if (val !== null) used.add(val.id);
  }
  return used;
};

/** Find and remove dangling data stored from previous versions */
const clearDangling = (): void => {
  const used = findUsedIds();
  for (const [key] of DB.prefix(db, "data/")) {
    if (!used.has(key.substring(5))) DB.del(db, key);
  }
  for (const [key] of cache) {
    if (!used.has(key)) DB.del(cache, key);
  }
};
