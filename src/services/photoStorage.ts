import type { Photo } from "../types";

export interface StoredPhoto {
  id: string;
  name: string;
  dataUrl: string; // Base64 encoded image data
  size: number;
  type: string;
}

export class PhotoStorageService {
  private static readonly STORAGE_KEY = "shanaCal_photos_data";
  private static readonly MAX_PHOTOS = 50; // Limit to prevent storage overflow
  private static readonly MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB per photo

  // Convert Photo to StoredPhoto
  static async photoToStoredPhoto(photo: Photo): Promise<StoredPhoto> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Calculate new dimensions to keep under size limit
        let { width, height } = img;
        const maxDimension = 1200; // Max width or height

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to stay under size limit
        let quality = 0.8;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        // If still too large, reduce quality
        while (dataUrl.length > this.MAX_PHOTO_SIZE && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        resolve({
          id: photo.id,
          name: photo.name,
          dataUrl,
          size: dataUrl.length,
          type: "image/jpeg",
        });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = photo.url;
    });
  }

  // Convert StoredPhoto back to Photo
  static storedPhotoToPhoto(storedPhoto: StoredPhoto): Photo {
    // Create a blob from the data URL
    const byteString = atob(storedPhoto.dataUrl.split(",")[1]);
    const mimeString = storedPhoto.dataUrl
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], storedPhoto.name, { type: mimeString });
    const url = URL.createObjectURL(blob);

    return {
      id: storedPhoto.id,
      name: storedPhoto.name,
      file,
      url,
    };
  }

  // Save photos to localStorage
  static async savePhotos(photos: Photo[]): Promise<void> {
    try {
      if (photos.length > this.MAX_PHOTOS) {
        console.warn(
          `Too many photos (${photos.length}). Limiting to ${this.MAX_PHOTOS}.`
        );
        photos = photos.slice(0, this.MAX_PHOTOS);
      }

      const storedPhotos: StoredPhoto[] = [];

      for (const photo of photos) {
        try {
          const storedPhoto = await this.photoToStoredPhoto(photo);
          storedPhotos.push(storedPhoto);
        } catch (error) {
          console.error(`Failed to store photo ${photo.name}:`, error);
        }
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedPhotos));
      console.log(`Saved ${storedPhotos.length} photos to localStorage`);
    } catch (error) {
      console.error("Error saving photos to localStorage:", error);
    }
  }

  // Load photos from localStorage
  static loadPhotos(): Photo[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const storedPhotos: StoredPhoto[] = JSON.parse(stored);
      const photos = storedPhotos.map((storedPhoto) =>
        this.storedPhotoToPhoto(storedPhoto)
      );

      console.log(`Loaded ${photos.length} photos from localStorage`);
      return photos;
    } catch (error) {
      console.error("Error loading photos from localStorage:", error);
      return [];
    }
  }

  // Clear photos from localStorage
  static clearPhotos(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log("Cleared photos from localStorage");
    } catch (error) {
      console.error("Error clearing photos from localStorage:", error);
    }
  }

  // Get storage usage for photos
  static getPhotosStorageUsage(): { count: number; totalSize: number } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return { count: 0, totalSize: 0 };

      const storedPhotos: StoredPhoto[] = JSON.parse(stored);
      const totalSize = storedPhotos.reduce(
        (sum, photo) => sum + photo.size,
        0
      );

      return { count: storedPhotos.length, totalSize };
    } catch (error) {
      console.error("Error getting photos storage usage:", error);
      return { count: 0, totalSize: 0 };
    }
  }
}

export const photoStorageService = new PhotoStorageService();
