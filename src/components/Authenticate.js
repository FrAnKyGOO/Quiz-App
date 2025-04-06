"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useStateContext from "@/hooks/useStateContext";

export default function Authenticate({ children }) {
    const { context } = useStateContext();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (context.participantId === 0) {
            router.replace("/");
        } else {
            setChecked(true);
        }
    }, [context.participantId, router]);

    if (!checked) return null; // หรือแสดง Loading

    return <>{children}</>;
}
