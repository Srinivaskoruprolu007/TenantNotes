// Re-export all Firebase related utilities
export * from './firebase';
export * from './firestore';

// Storage utilities
export const formatStorageSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const calculateNoteSize = (note: { title: string; content: string }): number => {
  // Rough estimation: 2 bytes per character for UTF-16 strings
  return (note.title.length + note.content.length) * 2;
};

export const checkStorageLimit = async (userId: string, noteSize: number): Promise<{ allowed: boolean; message: string }> => {
  const { getUserProfile } = await import('./firestore');
  const user = await getUserProfile(userId);
  
  if (!user) {
    return { allowed: false, message: 'User not found' };
  }
  
  const newUsedStorage = user.usedStorage + noteSize / (1024 * 1024); // Convert to MB
  
  if (newUsedStorage > user.storageLimit) {
    return {
      allowed: false,
      message: `Storage limit exceeded. You've used ${formatStorageSize(user.usedStorage * 1024 * 1024)} of ${formatStorageSize(user.storageLimit * 1024 * 1024)}.`,
    };
  }
  
  return { allowed: true, message: 'Storage check passed' };
};
