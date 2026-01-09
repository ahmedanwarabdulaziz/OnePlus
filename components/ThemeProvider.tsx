"use client";

import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0f1b4b", // Dark blue
    },
    secondary: {
      main: "#701621", // Dark red/burgundy
    },
    background: {
      default: "#ffffff", // White background
      paper: "#ffffff",
    },
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
  includeCssBaseline?: boolean;
}

export default function ThemeProvider({
  children,
  includeCssBaseline = false,
}: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      {includeCssBaseline && <CssBaseline />}
      {children}
    </MUIThemeProvider>
  );
}
