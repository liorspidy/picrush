import { FirebaseContext } from "@/firebase/firebase.context";
import { useContext } from "react";

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
};