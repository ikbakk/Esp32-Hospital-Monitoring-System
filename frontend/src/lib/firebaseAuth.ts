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
    return false;
  }
};

export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {}
};
