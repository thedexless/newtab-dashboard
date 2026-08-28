import { API } from "../../types";

/** A single service health check the user configures */
export type Service = {
  id: string;
  name: string;
  url: string;
};

/** Configuration stored in the widget data */
export type Data = {
  services: Service[];
  /** refresh interval in seconds */
  refreshSeconds: number;
};

/** Per-service health result */
export type CheckResult = {
  up: boolean;
  /** latency in ms */
  latency?: number;
  status?: number;
};

/** Cached results keyed by service id */
export type Cache = {
  timestamp: number;
  results: Record<string, CheckResult>;
};

export type Props = API<Data, Cache>;

export const defaultData: Data = {
  services: [],
  refreshSeconds: 60,
};