import React, { useCallback, useState } from "react";
import { AppContext, type Language } from "./AppContext";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [language, setLanguage] = useState<Language>(localStorage.getItem("lang") as Language || ("HE" as Language));

    const setLanguageHandler = useCallback((lang: Language) => {
        localStorage.setItem("lang", lang);
        setLanguage(lang);
    }, []);

    return (
        <AppContext.Provider
            value={{ language, setLanguage, setLanguageHandler }}
        >
            {children}
        </AppContext.Provider>
    );
};
