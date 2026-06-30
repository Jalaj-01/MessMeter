import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";
import { Capacitor } from '@capacitor/core';

export const loginWithGoogle = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // 1. Trigger the Native Google Account Picker
      const result = await FirebaseAuthentication.signInWithGoogle();
      
      // 2. Access the token safely (Fixes the TypeScript error)
      const idToken = result.credential?.idToken;

      if (!idToken) {
        throw new Error("No ID Token found in native sign-in result.");
      }
      
      // 3. Authenticate with Firebase using the native token
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    } 
    
    // Fallback for Web/Localhost testing
    else {
      const provider = new GoogleAuthProvider();
      const { signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup(auth, provider);
      return result.user;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Native Auth Failed";
    console.error("Login Error:", error);
    alert("Login Error: " + errorMessage);
  }
};

export const logout = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await FirebaseAuthentication.signOut();
    }
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};