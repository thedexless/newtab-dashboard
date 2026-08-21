import React from "react";
import { FormattedMessage } from "react-intl";
import { UiContext } from "../../contexts/ui";
import { exportStore, importStore, resetStore } from "../../db/action";
import { useKeyPress } from "../../hooks";
import { Icon } from "../shared";
import Logo from "../shared/Logo";
import Background from "./Background";
import Persist from "./Persist";
import "./Settings.sass";
import System from "./System";
import Widgets from "./Widgets";

const Settings: React.FC = () => {
  const { toggleSettings } = React.useContext(UiContext);

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to delete all of your Tabliss settings? This cannot be undone.",
      )
    )
      resetStore();
  };

  const handleExport = () => {
    const url = URL.createObjectURL(
      new Blob([exportStore()], { type: "application/json" }),
    );

    const a = withTempElement<HTMLAnchorElement>("a", (a) => {
      a.href = url;
      a.download = "tabliss.json";
      a.style.display = "none";
    });

    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const handleImport = () => {
    const input = withTempElement<HTMLInputElement>("input", (input) => {
      input.type = "file";
      input.style.display = "none";
      input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          const result = event.target?.result;
          if (typeof result !== "string") return;
          try {
            importStore(JSON.parse(result));
          } catch (error) {
            alert(
              `Invalid import file: ${
                error instanceof Error ? error.message : "Uknown error"
              }`,
            );
          }
        });
        reader.readAsText(file);
        input.remove();
      });
    });

    input.click();
  };

  useKeyPress(toggleSettings, ["Escape"]);

  return (
    <div className="Settings">
      <a onClick={toggleSettings} className="fullscreen" />

      <div className="plane">
        <Logo />

        <Background />

        <Widgets />

        <System />

        <p style={{ marginBottom: "2rem" }}>
          <a onClick={handleImport}>Import</a>,{" "}
          <a onClick={handleExport}>export</a> or{" "}
          <a onClick={handleReset}>reset</a> your settings
        </p>

        <Persist />

        <div style={{ textAlign: "center" }} className="Widget">
          <h4>Support Tabliss</h4>
          <p>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=FK7VRWS9A2EW4"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary"
              title="I do love coffee"
            >
              <Icon name="coffee" /> Donate a coffee 😍
            </a>
          </p>
          <p>
            <a href="https://tabliss.io/" target="_blank">
              <Icon name="globe" /> Website
            </a>
            &nbsp;&nbsp;
            <a
              href="https://twitter.com/tabliss"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="twitter" /> Twitter
            </a>
            &nbsp;&nbsp;
            <a
              href="https://github.com/joelshepherd/tabliss"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="github" /> GitHub
            </a>
          </p>
        </div>

        <FormattedMessage
          id="settings.translationCredits"
          description="Give yourself some credit :)"
          defaultMessage=" "
          tagName="p"
        />
      </div>
    </div>
  );
};

export default React.memo(Settings);

/** Create a temporary DOM element, configure it, append to body, and return it. */
function withTempElement<T extends HTMLElement = HTMLElement>(
  tag: string,
  configure: (el: T) => void,
): T {
  const el = document.createElement(tag) as T;
  configure(el);
  document.body.appendChild(el);
  return el;
}
