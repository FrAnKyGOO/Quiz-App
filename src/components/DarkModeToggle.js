"use client";

import { IconButton } from "@mui/material";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function DarkModeToggle() {
    const { darkMode, toggleDarkMode } = useThemeContext();

    return (
        <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
}
