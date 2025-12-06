import { createContext, type Dispatch, type SetStateAction } from "react";

export type Language = "EN" | "HE";

export interface AppContextType {
    language: Language;
    setLanguage: Dispatch<SetStateAction<Language>>;
    setLanguageHandler: (lang: Language) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
