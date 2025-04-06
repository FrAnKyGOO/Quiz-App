"use client";

import { AppBar, Button, Container, Toolbar, Typography, IconButton } from "@mui/material";
import React from "react";
import useStateContext from "../hooks/useStateContext";
import { Outlet } from "react-router";
import { useTheme } from "@/contexts/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { red } from "@mui/material/colors";

export default function Layout({ children }) {
    const { resetContext } = useStateContext();
    const { mode, toggleTheme } = useTheme();
    const router = useRouter();

    const logout = () => {
        resetContext();
        router.push("/");
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <Typography variant="h4" align="center" sx={{ flexGrow: 1 }}>
                        Quiz App
                    </Typography>

                    <Button sx={{color: '#ffffff'}} onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
            <main>{children}</main>
        </>
    );
}
