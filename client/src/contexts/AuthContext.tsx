import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getUserLocation, getPricingForCountry } from '@/lib/geolocation';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'Rookie' | 'Premium' | 'Inner Circle';
  expiryDate?: Date;
  paymentStatus: 'active' | 'expired' | 'pending';
  telegramUsername?: string;
  location?: {
    country: string;
    countryCode: string;
    currency: string;
    region: string;
  };
  hustlerCardURL?: string;
  createdAt: Date;
  emailVerified: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, name: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Get user location
    const location = await getUserLocation();
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      name,
      email: user.email!,
      role: 'Rookie',
      paymentStatus: 'pending',
      location,
      createdAt: new Date(),
      emailVerified: false
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
  }

  async function login(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in.');
    }
    
    return user;
  }

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfile(updates: Partial<UserProfile>) {
    if (!currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, updates);
    
    // Refresh user profile
    await refreshUserProfile();
  }

  async function refreshUserProfile() {
    if (!currentUser) return;
    
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as UserProfile;
      // Convert Firestore timestamps to Date objects
      if (data.expiryDate && typeof data.expiryDate === 'object') {
        data.expiryDate = (data.expiryDate as any).toDate();
      }
      if (data.createdAt && typeof data.createdAt === 'object') {
        data.createdAt = (data.createdAt as any).toDate();
      }
      setUserProfile(data);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await refreshUserProfile();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}