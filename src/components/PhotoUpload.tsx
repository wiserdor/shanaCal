import { useState, useRef } from "react";
import type { Photo } from "../types";
import { PhotoCollageService } from "../services/photoCollage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PhotoUploadProps {
  photos: Photo[];
  onPhotosUpdate: (photos: Photo[]) => void;
  onNext: () => void;
}

export function PhotoUpload({
  photos,
  onPhotosUpdate,
  onNext,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Resize image if too large
      let processedFile = file;
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        try {
          processedFile = await PhotoCollageService.resizeImage(
            file,
            1920,
            1080
          );
        } catch (error) {
          console.error("Error resizing image:", error);
          continue;
        }
      }

      const photo: Photo = {
        id: `${Date.now()}-${i}`,
        file: processedFile,
        url: URL.createObjectURL(processedFile),
        name: processedFile.name,
      };

      newPhotos.push(photo);
    }

    onPhotosUpdate([...photos, ...newPhotos]);
    setIsUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const removePhoto = (photoId: string) => {
    const photoToRemove = photos.find((photo) => photo.id === photoId);
    if (photoToRemove) {
      // Clean up blob URL to prevent memory leaks
      URL.revokeObjectURL(photoToRemove.url);
    }
    const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
    onPhotosUpdate(updatedPhotos);
  };

  const clearAllPhotos = () => {
    // Clean up all blob URLs to prevent memory leaks
    photos.forEach((photo) => {
      URL.revokeObjectURL(photo.url);
    });
    onPhotosUpdate([]);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">העלאת תמונות</h2>
        <p className="text-muted-foreground">
          העלה תמונות שישמשו ליצירת קולאז'ים עבור כל חודש בלוח השנה
        </p>
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-6xl text-muted-foreground">📸</div>
            <div>
              <p className="text-lg font-medium">
                גרור תמונות לכאן או לחץ לבחירה
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                תמונות JPG, PNG, GIF עד 5MB
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              disabled={isUploading}
              size="lg"
            >
              {isUploading ? "מעלה..." : "בחר תמונות"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>תמונות נבחרות ({photos.length})</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllPhotos();
                  }}
                  variant="outline"
                  size="sm"
                  disabled={photos.length === 0}
                >
                  נקה הכל
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  size="lg"
                >
                  המשך
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">הוראות</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• העלה לפחות 14 תמונות (תמונה אחת לכל חודש)</li>
            <li>• התמונות יסודרו אוטומטית בקולאז'ים יפים</li>
            <li>• ניתן להעלות תמונות נוספות בכל עת</li>
            <li>• התמונות יועלו רק למחשב שלך ולא לשרת</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
