import React, { FC, useState } from "react";
import { defaultData, Props } from "./types";

const FeedlySettings: FC<Props> = ({ data = defaultData, setData }) => {
  const services = data.services || [];
  const [draftName, setDraftName] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  const addService = () => {
    if (!draftName.trim() || !draftUrl.trim()) return;
    const service = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: draftName.trim(),
      url: draftUrl.trim(),
    };
    setData({ ...data, services: [...services, service] });
    setDraftName("");
    setDraftUrl("");
  };

  const removeService = (id: string) => {
    setData({ ...data, services: services.filter((s) => s.id !== id) });
  };

  return (
    <div className="InfraSettings">
      <label>
        Refresh every
        <input
          type="number"
          min={5}
          max={3600}
          value={data.refreshSeconds}
          onChange={(e) =>
            setData({ ...data, refreshSeconds: Number(e.target.value) || 60 })
          }
        />
        seconds
      </label>

      <hr />

      <label>Add service</label>
      <input
        type="text"
        placeholder="Name (e.g. OpenHands)"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Health URL (e.g. http://127.0.0.1:8000/health)"
        value={draftUrl}
        onChange={(e) => setDraftUrl(e.target.value)}
      />
      <button type="button" onClick={addService}>
        Add
      </button>

      {services.length > 0 ? (
        <ul className="service-list">
          {services.map((s) => (
            <li key={s.id}>
              <span>
                <strong>{s.name}</strong> — <code>{s.url}</code>
              </span>
              <button type="button" onClick={() => removeService(s.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="hint">
        Tip: the extension uses no-cors probing, so a host that is reachable
        shows as green. Add your Hermes gateway, OpenHands, Tailscale peers,
        VPS, etc.
      </p>
    </div>
  );
};

export default FeedlySettings;