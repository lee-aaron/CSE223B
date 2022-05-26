import {
  createTheme,
  CssBaseline,
  Theme,
  ThemeProvider as StyledThemeProvider,
} from "@mui/material";
import React, { useMemo } from "react";
import { useIsDarkMode } from "../state/user/hooks";

function getTheme(darkMode: boolean): Theme {
  return createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {
      fontFamily: "Yusei Magic",
    },
  });
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkMode = useIsDarkMode();

  const themeObject = useMemo(() => getTheme(darkMode), [darkMode]);

  return (
    <StyledThemeProvider theme={themeObject}>
      <CssBaseline />
      {children}
    </StyledThemeProvider>
  );
}