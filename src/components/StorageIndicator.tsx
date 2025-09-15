import { useState, useEffect } from "react";
import { LocalStorageService } from "../services/localStorage";
import { PhotoStorageService } from "../services/photoStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StorageIndicator() {
  const [storageInfo, setStorageInfo] = useState({
    photos: { count: 0, totalSize: 0 },
    used: 0,
    available: 0,
  });

  useEffect(() => {
    const updateStorageInfo = () => {
      const photosInfo = PhotoStorageService.getPhotosStorageUsage();
      const generalInfo = LocalStorageService.getStorageInfo();

      setStorageInfo({
        photos: photosInfo,
        used: generalInfo.used,
        available: generalInfo.available,
      });
    };

    updateStorageInfo();

    // Update every 5 seconds
    const interval = setInterval(updateStorageInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getUsagePercentage = (): number => {
    const total = storageInfo.used + storageInfo.available;
    return total > 0 ? (storageInfo.used / total) * 100 : 0;
  };

  const getUsageColor = (): string => {
    const percentage = getUsagePercentage();
    if (percentage > 80) return "text-red-600";
    if (percentage > 60) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">שימוש באחסון</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>תמונות:</span>
          <span>
            {storageInfo.photos.count} (
            {formatBytes(storageInfo.photos.totalSize)})
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span>נתונים:</span>
          <span>{formatBytes(storageInfo.used)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>זמין:</span>
          <span className={getUsageColor()}>
            {formatBytes(storageInfo.available)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              getUsagePercentage() > 80
                ? "bg-red-500"
                : getUsagePercentage() > 60
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center">
          {getUsagePercentage().toFixed(1)}% בשימוש
        </div>
      </CardContent>
    </Card>
  );
}
