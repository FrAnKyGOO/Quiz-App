"use client";

import { AppBar, Button, Container, Toolbar, Typography, IconButton } from "@mui/material";
import React from "react";
import useStateContext from "../hooks/useStateContext";
import { Outlet } from "react-router";
import { useTheme } from "@/contexts/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function Layout({ children }) {
    const { resetContext } = useStateContext();
    const { mode, toggleTheme } = useTheme();

    const logout = () => {
        resetContext();
        // navigate("/")
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">Quiz App</Typography>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main>{children}</main>
        </>
    );
}
