// For mounting the result
declare global {
  interface Window {
    mountResult?: {
      [id: string]: (data: SuggestionsResult) => void;
    };
  }
}

type SuggestionsResult = {
  [0]: string;
  [1]: string[];
};

export function getSuggestions(query: string, engineUrl: string) {
  return new Promise<string[]>((resolve, reject) => {
    if (!window.mountResult) {
      window.mountResult = {};
    }

    const id = "i" + Math.random().toString(36).slice(2); // Unique id to return to correct result

    const cleanup = () => {
      delete window.mountResult?.[id];
      document.getElementById(`suggestionsQuery${id}`)?.remove();
    };

    window.mountResult[id] = (data: SuggestionsResult) => {
      cleanup();
      resolve(data[1]);
    };

    const scriptToAdd = document.createElement("script");

    scriptToAdd.id = `suggestionsQuery${id}`;
    scriptToAdd.onerror = () => {
      cleanup();
      reject(new Error("Failed to load suggestions"));
    };
    scriptToAdd.src = engineUrl
      .replace("{searchTerms}", query)
      .replace("{callback}", `mountResult.${id}`);

    document.head.appendChild(scriptToAdd);
  });
}
