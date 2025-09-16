import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

interface FirebaseLogin {
  email: string;
  password: string;
}

export const isFirebaseAuthenticated = async ({
  email,
  password,
}: FirebaseLogin): Promise<boolean> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error("Sign in error:", error);
    return false;
  }
};

export const firebaseSignOut = async () => {
  try {
    console.log(auth.currentUser);
    await signOut(auth);
    console.log("Signed out successfully");
    console.log(auth.currentUser);
  } catch (error) {
    console.error("Sign out error:", error);
  }
};
