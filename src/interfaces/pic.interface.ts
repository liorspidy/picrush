import type firebase from "firebase/compat/app"

export interface IPic {
    userId: string | null
    src : string,
    uploadTime: Date | firebase.firestore.FieldValue
    width: number,
    height: number
}