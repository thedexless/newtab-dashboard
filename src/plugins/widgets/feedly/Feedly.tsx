import React from "react";
import { defineMessages } from "react-intl";
import { useCachedEffect, useFormatMessages } from "../../../hooks";
import { getArticles } from "./api";
import { defaultData, Props } from "./types";
import "./Feedly.sass";

const CACHE_MS = 5 * 60 * 1000; // refresh every 5 minutes

const Feedly: React.FC<Props> = ({
  cache,
  data = defaultData,
  loader,
  setCache,
}) => {
  const translated = useFormatMessages(messages);

  // Fetch (and refresh) the Feedly stream
  useCachedEffect(
    () => {
      getArticles(
        { token: data.token, streamId: data.streamId, count: data.count },
        loader,
      ).then(setCache);
    },
    cache ? cache.timestamp + CACHE_MS : 0,
    [data.token, data.streamId, data.count],
  );

  const articles = cache ? cache.articles : [];

  if (!data.token) {
    return (
      <div className="Feedly">
        <span className="message">Feedly — set your API token in settings</span>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="Feedly">
        <span className="message">-</span>
      </div>
    );
  }

  return (
    <div className="Feedly">
      <ul className="headlines">
        {articles.slice(0, data.count).map((item) => (
          <li key={item.id} className="headline">
            {item.source && item.source.iconUrl ? (
              <img
                className="source-icon"
                src={item.source.iconUrl}
                alt=""
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <a href={item.url} title={item.title} target="_blank" rel="noopener noreferrer">
              <span className="title">{item.title}</span>
              {item.source && item.source.title ? (
                <span className="source">{item.source.title}</span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
      <p className="attribution">
        {translated.poweredBy} <a href="https://feedly.com" target="_blank" rel="noopener noreferrer">Feedly</a>
      </p>
    </div>
  );
};

const messages = defineMessages({
  poweredBy: {
    id: "plugins.feedly.poweredBy",
    description: "Feedly attribution",
    defaultMessage: "Powered by",
  },
});

export default Feedly;