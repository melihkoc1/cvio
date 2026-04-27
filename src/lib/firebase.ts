// Firebase config henüz ayarlanmadı — UI önizlemesi için stub kullanılıyor
import type { User } from 'firebase/auth';

export const auth = null as any;

export async function signInWithGoogle(): Promise<User> {
  throw new Error('Firebase yapılandırılmadı');
}

export async function signOutUser(): Promise<void> {
  // no-op
}

export function onAuthStateChanged(_auth: any, callback: (user: User | null) => void) {
  callback(null);
  return () => {};
}

export type { User };
