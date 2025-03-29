"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const stateContext = createContext();

const getFreshContext = () => {
    if (typeof window !== "undefined") {
        const storedContext = localStorage.getItem("context");
        if (storedContext === null) {
            const defaultContext = {
                participantId: 0,
                timeTaken: 0,
                selectedOptions: [],
            };
            localStorage.setItem("context", JSON.stringify(defaultContext));
            return defaultContext;
        }

        console.log(storedContext);
        return JSON.parse(storedContext);
    }
    return { participantId: 0, timeTaken: 0, selectedOptions: [] };
};

export default function useStateContext() {
    const { context, setContext } = useContext(stateContext);

    return {
        context,
        setContext: (obj) => {
            setContext((prevContext) => {
                const newContext = { ...prevContext, ...obj };
                if (typeof window !== "undefined") {
                    localStorage.setItem("context", JSON.stringify(newContext));
                }
                return newContext;
            });
        },
        resetContext: () => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("context");
            }
            setContext({ participantId: 0, timeTaken: 0, selectedOptions: [] });
        },
    };
}

export function ContextProvider({ children }) {
    const [context, setContext] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedContext = localStorage.getItem("context");
            
            // ✅ เช็คว่าค่าใน localStorage เป็น null หรือไม่
            try {
                setContext(storedContext ? JSON.parse(storedContext) : { 
                    participantId: 0, 
                    timeTaken: 0, 
                    selectedOptions: [] 
                });
            } catch (error) {
                console.error("Error parsing JSON from localStorage:", error);
                localStorage.removeItem("context"); // ล้างค่าเสีย
                setContext({ participantId: 0, timeTaken: 0, selectedOptions: [] });
            }
        }
    }, []);

    if (context === null) return <div>Loading...</div>;

    return (
        <stateContext.Provider value={{ context, setContext }}>
            {children}
        </stateContext.Provider>
    );
}
