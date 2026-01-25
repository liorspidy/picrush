// src/firebase/firebase.context.tsx
import {
    createContext,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";
import { db, storage } from "./firebase.config";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

interface FirebaseContextProps {
    db: Firestore;
    storage: FirebaseStorage;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    userId: string | null;
    setUserId: Dispatch<SetStateAction<string | null>>;
    val: number;
    setVal: Dispatch<SetStateAction<number>>;
    maxVal: number;
    setMaxVal: Dispatch<SetStateAction<number>>;
    bgImages: string[];
}

export const FirebaseContext = createContext<FirebaseContextProps | undefined>(
    undefined,
);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
    const [val, setVal] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [maxVal, setMaxVal] = useState<number>(20);
    const bgImages = Object.values(
        import.meta.glob("@/assets/images/*.{png,jpg,jpeg,webp,svg}", {
            eager: true,
            import: "default",
        }),
    ) as string[];

    return (
        <FirebaseContext.Provider
            value={{
                db,
                storage,
                isLoading,
                setIsLoading,
                userId,
                setUserId,
                val,
                setVal,
                maxVal,
                setMaxVal,
                bgImages,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
};
