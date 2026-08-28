import React from "react";
import { useCachedEffect } from "../../../hooks";
import { checkService } from "./api";
import { defaultData, Props } from "./types";
import "./Infra.sass";

const Infra: React.FC<Props> = ({
  cache,
  data = defaultData,
  loader,
  setCache,
}) => {
  const services = data.services || [];

  // Probe all services, refreshed on interval
  useCachedEffect(
    () => {
      const controller = new AbortController();
      const { signal } = controller;
      Promise.all(
        services.map(async (service) => {
          const result = await checkService(service, signal);
          return [service.id, result] as const;
        }),
      ).then((pairs) => {
        setCache({
          timestamp: Date.now(),
          results: Object.fromEntries(pairs),
        });
      });
      return () => controller.abort();
    },
    cache ? cache.timestamp + data.refreshSeconds * 1000 : 0,
    [services.map((s) => s.id).join(","), data.refreshSeconds],
  );

  if (services.length === 0) {
    return (
      <div className="Infra">
        <span className="message">
          Infra — add services in settings (name + health URL)
        </span>
      </div>
    );
  }

  const results = cache ? cache.results : {};

  return (
    <div className="Infra">
      {services.map((service) => {
        const result = results[service.id];
        const up = result ? result.up : undefined;
        return (
          <div
            key={service.id}
            className={`service ${up === undefined ? "pending" : up ? "up" : "down"}`}
            title={`${service.name} — ${up === undefined ? "checking..." : up ? `up (${result?.latency}ms)` : "down"}`}
          >
            <span className="dot" />
            <span className="name">{service.name}</span>
            {result && up ? (
              <span className="latency">{result.latency}ms</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default Infra;