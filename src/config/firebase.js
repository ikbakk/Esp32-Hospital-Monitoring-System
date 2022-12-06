import { initializeApp } from "firebase/app"
import { firebaseConfig } from "./firebase.config"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getPerformance } from "firebase/performance"

export const Firebase = initializeApp(firebaseConfig)
export const auth = getAuth()
export const Providers = { google: new GoogleAuthProvider() }
export const database = getDatabase()
export const perf = getPerformance(Firebase)
