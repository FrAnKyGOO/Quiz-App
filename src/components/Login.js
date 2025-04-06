"use client";

import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Card, CardContent, Typography } from "@mui/material";
import Center from "./Center.js";
import useForm from "@/hooks/useForm.js";
import { createAPIEndpoint, ENDPOINTS } from "@/apis/index.js";
import useStateContext from "@/hooks/useStateContext.js";
import { useRouter } from "next/navigation";

const getFreshModel = () => ({
    name: "",
    email: "",
});

export default function Login() {
    const { context, setContext } = useStateContext();

    const { values, setValues, errors, setErrors, handleInputChange } = useForm(getFreshModel);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    // ✅ ป้องกัน Hydration Mismatch โดยใช้ useEffect เพื่อเซ็ตค่าเริ่มต้นหลังจากโหลดบนไคลเอนต์
    useEffect(() => {
        setIsClient(true);
        setValues(getFreshModel());
    }, []);

    const login = (e) => {
        e.preventDefault();
        if (validate()) {
            createAPIEndpoint(ENDPOINTS.participant)
                .post(values)
                .then((res) => {
                    const participantId = res.data.participantId;

                    // อัปเดต context
                    setContext({ participantId });
                    localStorage.setItem("participantId", res.data.participantId);
                    // ไปหน้า Quiz หลังจาก login สำเร็จ
                    router.push("/Quiz");
                })
                .catch((err) => console.log(err));
        }
    };

    if (!isClient) return null; // ✅ ป้องกัน SSR Hydration Mismatch

    const validate = () => {
        let temp = {};
        temp.email = /\S+@\S+\.\S+/.test(values.email) ? "" : "Email is not valid.";
        temp.name = values.name != "" ? "" : "This field is required.";
        setErrors(temp);
        return Object.values(temp).every((x) => x == "");
    };

    return (
        <Center>
            <Card sx={{ width: 400 }}>
                <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h3" sx={{ my: 3 }}>
                        Quiz App
                    </Typography>
                    <Box
                        sx={{
                            "& .MuiTextField-root": { margin: 1, width: "90%" },
                        }}
                    >
                        <form noValidate autoComplete="on" onSubmit={login}>
                            <TextField
                                label="Email"
                                name="email"
                                value={values.email || ""}
                                onChange={handleInputChange}
                                variant="outlined"
                                {...(errors.email && { error: true, helperText: errors.email })}
                            />

                            <TextField
                                label="Name"
                                name="name"
                                value={values.name || ""}
                                onChange={handleInputChange}
                                variant="outlined"
                                {...(errors.name && { error: true, helperText: errors.name })}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{ width: "90%", mt: 2 }}
                            >
                                Start
                            </Button>
                        </form>
                    </Box>
                </CardContent>
            </Card>
        </Center>
    );
}
