"use client"; // Needed for Next.js 13+ with App Router

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createContext, useState, useContext, useEffect } from "react";

// Create Theme Context
const ThemeContext = createContext();

export function ThemeProviderWrapper({ children }) {
    const [mode, setMode] = useState("light");

    useEffect(() => {
        const savedMode = localStorage.getItem("theme") || "light";
        setMode(savedMode);
    }, []);

    const toggleTheme = () => {
        const newMode = mode === "light" ? "darkddf" : "light";
        setMode(newMode);
        localStorage.setItem("theme", newMode);
    };

    const theme = createTheme({
        palette: {
            mode,
        },
    });

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
