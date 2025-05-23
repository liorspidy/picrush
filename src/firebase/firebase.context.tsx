// src/firebase/firebase.context.tsx
import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { db, storage } from "./firebase.config";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import img1 from '@/assets/images/img1.jpeg';
import img2 from '@/assets/images/img2.jpeg';
import img3 from '@/assets/images/img3.jpeg';
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

export const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [val, setVal] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxVal, setMaxVal] = useState<number>(20);
  const [bgImages , setBgImages] = useState<string[]>([img1, img2, img3]);

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
        bgImages
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
