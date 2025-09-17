import type { Photo, PersonalDate, Customization } from "../types";

const STORAGE_KEYS = {
  PHOTOS: "shanaCal_photos",
  PERSONAL_DATES: "shanaCal_personalDates",
  CUSTOMIZATION: "shanaCal_customization",
  CURRENT_STEP: "shanaCal_currentStep",
} as const;

export class LocalStorageService {
  // Photos persistence
  static savePhotos(photos: Photo[]): void {
    try {
      // Convert photos to a serializable format
      const serializablePhotos = photos.map((photo) => ({
        id: photo.id,
        name: photo.name,
        url: photo.url, // Keep the blob URL for now
        // Note: File objects can't be serialized, so we'll need to handle this differently
      }));
      localStorage.setItem(
        STORAGE_KEYS.PHOTOS,
        JSON.stringify(serializablePhotos)
      );
    } catch (error) {
      console.error("Error saving photos to localStorage:", error);
    }
  }

  static loadPhotos(): Photo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      if (!stored) return [];

      const serializablePhotos = JSON.parse(stored);
      // Convert back to Photo objects
      // Note: We'll need to handle File objects separately
      return serializablePhotos.map((photo: Photo) => ({
        id: photo.id,
        name: photo.name,
        url: photo.url,
        file: new File([], photo.name), // Placeholder file
      }));
    } catch (error) {
      console.error("Error loading photos from localStorage:", error);
      return [];
    }
  }

  // Personal dates persistence
  static savePersonalDates(dates: PersonalDate[]): void {
    try {
      const serializableDates = dates.map((date) => ({
        id: date.id,
        title: date.title,
        date: date.date.toISOString(),
        type: date.type,
        description: date.description,
      }));
      localStorage.setItem(
        STORAGE_KEYS.PERSONAL_DATES,
        JSON.stringify(serializableDates)
      );
    } catch (error) {
      console.error("Error saving personal dates to localStorage:", error);
    }
  }

  static loadPersonalDates(): PersonalDate[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PERSONAL_DATES);
      if (!stored) return [];

      const serializableDates = JSON.parse(stored);
      return serializableDates.map((date: PersonalDate) => ({
        id: date.id,
        title: date.title,
        date: new Date(date.date),
        type: date.type,
        description: date.description,
      }));
    } catch (error) {
      console.error("Error loading personal dates from localStorage:", error);
      return [];
    }
  }

  // Customization persistence
  static saveCustomization(customization: Customization): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOMIZATION,
        JSON.stringify(customization)
      );
    } catch (error) {
      console.error("Error saving customization to localStorage:", error);
    }
  }

  static loadCustomization(): Customization | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMIZATION);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error loading customization from localStorage:", error);
      return null;
    }
  }

  // Current step persistence
  static saveCurrentStep(step: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step);
    } catch (error) {
      console.error("Error saving current step to localStorage:", error);
    }
  }

  static loadCurrentStep(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
    } catch (error) {
      console.error("Error loading current step from localStorage:", error);
      return null;
    }
  }

  // Clear all data
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  // Get storage usage info
  static getStorageInfo(): { used: number; available: number } {
    try {
      let used = 0;
      Object.values(STORAGE_KEYS).forEach((key) => {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length;
        }
      });

      // Estimate available space (most browsers have 5-10MB limit)
      const available = 5 * 1024 * 1024 - used; // 5MB - used

      return { used, available };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return { used: 0, available: 0 };
    }
  }
}

export const localStorageService = new LocalStorageService();
