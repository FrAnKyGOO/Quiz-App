"use client";

import { createAPIEndpoint, ENDPOINTS } from "@/apis";
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getFormatedTime } from "../Helper/index";

export default function Quiztion() {
    const [qns, setQns] = useState([]);
    const [qnIndex, setQnIndex] = useState(0);
    const [timeToken, setTimeToken] = useState(0);
    const { context, setContext } = useStateContext();

    let timer;

    const startTimer = () => {
        timer = setInterval(() => {
            setTimeToken((prev) => prev + 1);
        }, [1000]);
    };

    useEffect(() => {
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
    }, []);

    const updateAnswer = (qnId, optionsIdx) => {
        const temp = [...context.selectedOptions];
        temp.push({
            qnId,
            selected: optionIdx,
        });
        if (qnIndex < 4) {
            setContext({ selectedOptions: [...temp] });
            setQnIndex(qnIndex + 1);
        } else {
            setContext({ selectedOptions: [...temp], timeToken });
            // navigate("/result")
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
                action={<Typography>{getFormatedTime(timeToken)}</Typography>}
            />
            <Box>
                <LinearProgress variant="determinate" value={((qnIndex + 1) * 100) / 5} />
            </Box>
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
