import { useEffect } from "react";
import { useAppDispatch } from "../hooks";

import { updateMatchesDarkMode } from "./actions";

export default function Updater(): null {
  const dispatch = useAppDispatch();

  // keep dark mode in sync with the system
  useEffect(() => {
    const darkHandler = (match: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }));
    };

    const match = window?.matchMedia("(prefers-color-scheme: dark)");
    dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }));

    if (match?.addEventListener) {
      match?.addEventListener("change", darkHandler);
    }

    return () => {
      if (match?.removeEventListener) {
        match?.removeEventListener("change", darkHandler);
      }
    };
  }, [dispatch]);

  return null;
}
