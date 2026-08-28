import { useEffect, useMemo, useState } from "react";

export function useObjectUrl(data?: Blob) {
  const url = useMemo(() => (data ? URL.createObjectURL(data) : null), [data]);

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}

export function useObjectUrls(data: Blob[]) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const created = data.map(URL.createObjectURL);
    setUrls(created);

    return () => {
      created.forEach(URL.revokeObjectURL);
      setUrls([]);
    };
  }, [data]);

  return urls;
}
