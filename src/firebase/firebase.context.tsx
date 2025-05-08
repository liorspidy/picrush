// src/firebase/firebase.context.tsx
import { createContext, useState, type ReactNode } from "react";
import { db, storage } from "./firebase.config";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

interface FirebaseContextProps {
  db: Firestore;
  storage: FirebaseStorage;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  userId: string | null;
  setUserId: (value: string | null) => void;
  val: number;
  setVal: (value: number) => void
  maxVal: number;
  setMaxVal: (value: number) => void
}

export const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [val, setVal] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxVal, setMaxVal] = useState<number>(20);

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
        setMaxVal
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
