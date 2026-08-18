import { Config } from "../../types";
import Feedly from "./Feedly";
import FeedlySettings from "./FeedlySettings";

const config: Config = {
  key: "widget/feedly",
  name: "Feedly",
  description: "Your AI-curated Feedly stream (Leo priorities, boards, unread).",
  dashboardComponent: Feedly,
  settingsComponent: FeedlySettings,
};

export default config;