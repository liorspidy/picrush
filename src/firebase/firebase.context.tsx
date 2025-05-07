// src/firebase/firebase.context.tsx
import { createContext, useState, type ReactNode } from 'react';
import { db, storage } from './firebase.config';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

interface FirebaseContextProps {
  db: Firestore;
  storage: FirebaseStorage;
  isLoading: boolean
  setIsLoading: (value: boolean | ((prevState: boolean) => boolean)) => void;
}

export const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FirebaseContext.Provider value={{ db, storage, isLoading, setIsLoading }}>
      {children}
    </FirebaseContext.Provider>
  );
};


