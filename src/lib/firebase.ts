import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'xd',
  authDomain: 'cvapp-f8d25.firebaseapp.com',
  projectId: 'cvapp-f8d25',
  storageBucket: 'cvapp-f8d25.firebasestorage.app',
  messagingSenderId: '839965666924',
  appId: '1:839965666924:web:aca67a6871d9aeab92f249',
  measurementId: 'G-Y0YX9GCQNP',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged, type User };
