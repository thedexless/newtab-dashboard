import { useState, useEffect, useCallback } from "react";
import { usePushError } from "../api";

function areWeFullscreen() {
  return Boolean(document.fullscreenElement);
}

export function useFullscreen() {
  const pushError = usePushError();
  const [isFullscreen, setIsFullscreen] = useState(areWeFullscreen());

  const enterOrExit = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(pushError);
    }
  }, [pushError]);

  const toggleFullscreen = document.fullscreenEnabled ? enterOrExit : false;

  useEffect(() => {
    if (!document.fullscreenEnabled) return;

    const onChange = () => setIsFullscreen(areWeFullscreen());
    document.onfullscreenchange = onChange;
    return () => {
      document.onfullscreenchange = null;
    };
  }, []);

  return [isFullscreen, toggleFullscreen] as const;
}
