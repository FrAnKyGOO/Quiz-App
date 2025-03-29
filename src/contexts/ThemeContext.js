"use client"; // Needed for Next.js 13+ with App Router

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createContext, useState, useMemo, useContext } from "react";

// Create Theme Context
const ThemeContext = createContext();

export function ThemeProviderWrapper({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    // Define Light and Dark Themes
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                },
            }),
        [darkMode]
    );

    const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

// Custom hook for using theme context
export function useThemeContext() {
    return useContext(ThemeContext);
}
