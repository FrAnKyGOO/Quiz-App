"use client";

import { createAPIEndpoint, ENDPOINTS, BASE_URL } from "@/apis";
import useStateContext, { stateContext } from "@/hooks/useStateContext";
import {
    Card,
    CardContent,
    CardHeader,
    LinearProgress,
    List,
    ListItemButton,
    Typography,
    Box,
    CardMedia,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFormatedTime } from "../Helper/index";
import { useRouter } from "next/navigation";

export default function Quiztion() {
    const [qns, setQns] = useState([]);
    const [qnIndex, setQnIndex] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const { context, setContext } = useStateContext();
    const { participantId } = context || {}; // ป้องกันตอน context ยังไม่พร้อม
    const router = useRouter();

    let timer;

    const startTimer = () => {
        timer = setInterval(() => {
            setTimeTaken((prev) => prev + 1);
        }, 1000);
    };

    useEffect(() => {
        if (!context || !context.participantId) {
            console.log("รอ context พร้อมก่อน...");
            return;
        }

        console.log("context พร้อมแล้ว:", context);

        // โหลดคำถาม ฯลฯ
    }, [context.participantId]);

    useEffect(() => {
        if (!participantId) {
            const storedId = localStorage.getItem("participantId");
            if (storedId) {
                setContext({ participantId: storedId });
            }
        }
    }, []);

    useEffect(() => {
        if (!participantId) return;

        setContext({
            timeTaken: 0,
            selectedOptions: [],
        });

        createAPIEndpoint(ENDPOINTS.question)
            .fetch()
            .then((res) => {
                setQns(res.data);
                console.log(res.data);
                startTimer();
            })
            .catch((err) => {
                console.log(err);
            });

        return () => {
            clearInterval(timer);
        };
    }, [participantId]);

    const updateAnswer = (qnId, optionsIdx) => {
        const temp = [...context.selectedOptions];
        temp.push({
            qnId,
            selected: optionsIdx,
        });
        if (qnIndex < 4) {
            setContext({ selectedOptions: [...temp] });
            setQnIndex(qnIndex + 1);
        } else {
            setContext({ selectedOptions: [...temp], timeTaken });
            router.push("/Result");
        }
    };

    return qns.length > 0 ? (
        <Card
            sx={{
                maxWidth: 640,
                mx: "auto",
                mt: 5,
                "& .MuiCardHeader-action": { m: 0, alignSelf: "center" },
            }}
        >
            <CardHeader
                title={"Question " + (qnIndex + 1) + " of 5"}
                action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
            />
            <Box>
                <LinearProgress variant="determinate" value={((qnIndex + 1) * 100) / 5} />
            </Box>

            {qns[qnIndex].imageName != null ? (
                <CardMedia
                    component="img"
                    image={BASE_URL + "images/" + qns[qnIndex].imageName}
                    sx={{ width: "auto", m: "10px auto" }}
                />
            ) : null}

            <CardContent>
                <Typography variant="h6">{qns[qnIndex].qnInWords}</Typography>
                <List>
                    {qns[qnIndex].options.map((item, idx) => (
                        <ListItemButton
                            disableRipple
                            key={idx}
                            onClick={() => updateAnswer(qns[qnIndex].qnId, idx)}
                        >
                            <div>
                                <b>{String.fromCharCode(65 + idx) + " . "}</b>
                                {item}
                            </div>
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    ) : null;
}
