import { API } from "../../types";
import { Quote } from "./types";

// Get developer excuse
async function getDeveloperExcuse(): Promise<Partial<Quote>> {
  try {
    const res = await fetch("https://api.tabliss.io/v1/developer-excuses");
    const body = await res.json();

    return {
      quote: body.data,
    };
  } catch (err) {
    return {
      quote: "Unable to get a new developer excuse.",
    };
  }
}

/** Shared 429 handler — extracts the message and returns a "too many requests" response. */
function tooManyRequests(body: any): { author: string; quote: string } {
  return {
    author: body.error.message.split(".")[1] + ".",
    quote: "Too many requests this hour.",
  };
}

// Get quote of the day
async function getQuoteOfTheDay(category?: string): Promise<Partial<Quote>> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);

  const url = `https://quotes.rest/qod.json${
    category ? `?${params}` : ""
  }`;
  const res = await fetch(url);
  const body = await res.json();

  if (res.status === 429) return tooManyRequests(body);

  if (body?.contents?.quotes?.[0]) {
    return {
      author: body.contents.quotes[0].author,
      quote: body.contents.quotes[0].quote,
    };
  }

  return {};
}

// Get bible verse of the day
async function getBibleVerse(): Promise<Partial<Quote>> {
  const res = await fetch("https://quotes.rest/bible/vod.json");
  const body = await res.json();

  if (res.status === 429) return tooManyRequests(body);

  if (body?.contents) {
    return {
      author: `${body.contents.book} ${body.contents.chapter}:${body.contents.number}`,
      quote: body.contents.verse,
    };
  }

  return {};
}

export async function getQuote(
  loader: API["loader"],
  category: string,
): Promise<Quote> {
  const fetchByCategory: Record<string, () => Promise<Partial<Quote>>> = {
    developerexcuses: getDeveloperExcuse,
    bible: getBibleVerse,
  };
  const fetcher = fetchByCategory[category] ?? (() => getQuoteOfTheDay(category));

  loader.push();
  const data = await fetcher();
  loader.pop();

  return {
    ...data,
    quote: cleanQuote(data.quote ?? ""),
    timestamp: Date.now(),
  };
}

function cleanQuote(rawQuote: string) {
  const replacements: [RegExp, string][] = [
    // Change straight quotes following a non-whitespace char to closing curvy quote (’)
    [/(\S)'|"/g, "$1’"],
    // Change remaining straight quotes (following whitespace) to opening curvy quote (‘)
    [/(^|\s)'|"/g, "$1‘"],
    // Replace 3+ dots with proper ellipsis (…)
    [/\.{3,}/g, "…"],
    // Collapse multiple spaces into one
    [/\s{2,}/g, " "],
    // Replace dashes between whitespace with proper em dash (—)
    [/\s-\s/g, "—"],
  ];

  const quote = replacements.reduce(
    (q, [pattern, replacement]) => q.replace(pattern, replacement),
    rawQuote.trim(),
  );

  // Add a period at the end if there's no closing punctuation
  return /[.?!…’"']$/.test(quote) ? quote : `${quote}.`;
}
