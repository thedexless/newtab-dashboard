import React, { FC } from "react";
import { defaultData, Props } from "./types";

const FeedlySettings: FC<Props> = ({ data = defaultData, setData }) => (
  <div className="FeedlySettings">
    <label>
      Feedly developer token
      <input
        type="password"
        value={data.token || ""}
        placeholder="Paste your Feedly API token"
        onChange={(event) => setData({ ...data, token: event.target.value })}
      />
    </label>
    <p className="hint">
      Get one at{" "}
      <a href="https://feedly.com/v3/auth/dev" target="_blank" rel="noopener noreferrer">
        feedly.com/v3/auth/dev
      </a>
      {" "}(or Dev Settings → API Tokens). Needed to read the AI-curated stream.
    </p>

    <label>
      Stream ID
      <input
        type="text"
        value={data.streamId}
        onChange={(event) => setData({ ...data, streamId: event.target.value })}
      />
    </label>
    <p className="hint">
      e.g. <code>user/&lt;id&gt;/category/global.all</code> for all feeds, or the ID of a
      Leo priority / board / AI feed (found in the Feedly URL when open).
    </p>

    <label>
      Number of headlines
      <input
        type="number"
        min={1}
        max={100}
        value={data.count}
        onChange={(event) =>
          setData({ ...data, count: Number(event.target.value) || 10 })
        }
      />
    </label>
  </div>
);

export default FeedlySettings;