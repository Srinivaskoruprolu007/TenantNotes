import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { app } from './firebase';

// Initialize Firestore
export const db = getFirestore(app);

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  NOTES: 'notes',
  SUBSCRIPTIONS: 'subscriptions',
} as const;

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  subscriptionId?: string;
  storageLimit: number; // in MB
  usedStorage: number; // in MB
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  isArchived: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastEditedAt: Timestamp;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  billingCycle: 'monthly' | 'yearly';
  features: {
    storageLimit: number; // in MB
    maxNotes: number;
    maxTags: number;
    export: boolean;
    prioritySupport: boolean;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Functions
export const createUserProfile = async (userData: Omit<UserProfile, 'createdAt' | 'updatedAt' | 'storageLimit' | 'usedStorage'>) => {
  const userRef = doc(db, COLLECTIONS.USERS, userData.uid);
  const now = serverTimestamp() as Timestamp;
  
  const newUser: UserProfile = {
    ...userData,
    storageLimit: 100, // 100MB free tier
    usedStorage: 0,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(userRef, newUser);
  return newUser;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as UserProfile) : null;
};

// Note Functions
export const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'lastEditedAt'>) => {
  const notesRef = collection(db, COLLECTIONS.NOTES);
  const now = serverTimestamp() as Timestamp;
  
  const newNote: Omit<Note, 'id'> = {
    ...noteData,
    isArchived: false,
    isPinned: false,
    tags: noteData.tags || [],
    createdAt: now,
    updatedAt: now,
    lastEditedAt: now,
  };

  const noteRef = doc(notesRef);
  await setDoc(noteRef, newNote);
  return { id: noteRef.id, ...newNote };
};

export const updateNote = async (noteId: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>) => {
  const noteRef = doc(db, COLLECTIONS.NOTES, noteId);
  const now = serverTimestamp() as Timestamp;
  
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: now,
    lastEditedAt: now,
  });
};

export const getNotesByUser = async (userId: string, options: { archived?: boolean } = {}) => {
  const notesRef = collection(db, COLLECTIONS.NOTES);
  const q = query(
    notesRef,
    where('userId', '==', userId),
    ...(options.archived !== undefined ? [where('isArchived', '==', options.archived)] : [])
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Note[];
};

// Subscription Functions
export const getSubscription = async (subscriptionId: string): Promise<Subscription | null> => {
  const subRef = doc(db, COLLECTIONS.SUBSCRIPTIONS, subscriptionId);
  const subSnap = await getDoc(subRef);
  return subSnap.exists() ? (subSnap.data() as Subscription) : null;
};

export const updateUserSubscription = async (userId: string, subscriptionId: string) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, {
    subscriptionId,
    updatedAt: serverTimestamp(),
  });
};

// Initialize default subscriptions if they don't exist
const DEFAULT_SUBSCRIPTIONS: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Free',
    description: 'Basic note-taking features',
    price: 0,
    billingCycle: 'monthly',
    features: {
      storageLimit: 100, // 100MB
      maxNotes: 100,
      maxTags: 20,
      export: false,
      prioritySupport: false,
    },
    isActive: true,
  },
  {
    name: 'Pro',
    description: 'Advanced features for power users',
    price: 499, // $4.99/month
    billingCycle: 'monthly',
    features: {
      storageLimit: 1024, // 1GB
      maxNotes: 1000,
      maxTags: 100,
      export: true,
      prioritySupport: false,
    },
    isActive: true,
  },
  {
    name: 'Pro Annual',
    description: 'Advanced features with 2 months free',
    price: 4790, // $47.90/year (equivalent to $3.99/month)
    billingCycle: 'yearly',
    features: {
      storageLimit: 1024, // 1GB
      maxNotes: 1000,
      maxTags: 100,
      export: true,
      prioritySupport: false,
    },
    isActive: true,
  },
];

export const initializeDefaultSubscriptions = async () => {
  const batch = [];
  const now = serverTimestamp() as Timestamp;
  
  for (const sub of DEFAULT_SUBSCRIPTIONS) {
    const subRef = doc(collection(db, COLLECTIONS.SUBSCRIPTIONS));
    batch.push(setDoc(subRef, {
      ...sub,
      createdAt: now,
      updatedAt: now,
    }));
  }
  
  try {
    await Promise.all(batch);
    console.log('Default subscriptions initialized');
  } catch (error) {
    console.error('Error initializing default subscriptions:', error);
  }
};
