import { useState, useEffect } from "react";
import { Calendar } from "./components/Calendar";
import { PhotoUpload } from "./components/PhotoUpload";
import { PersonalDates } from "./components/PersonalDates";
import { CustomizationPanel } from "./components/CustomizationPanel";
import { ExportPanel } from "./components/ExportPanel";
import { StorageIndicator } from "./components/StorageIndicator";
import type { Photo, PersonalDate } from "./types";
import { generateCalendarMonths } from "./lib/utils";
import { LocalStorageService } from "./services/localStorage";
import { PhotoStorageService } from "./services/photoStorage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function App() {
  const [currentStep, setCurrentStep] = useState<
    "photos" | "dates" | "customize" | "preview" | "export"
  >("photos");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [personalDates, setPersonalDates] = useState<PersonalDate[]>([]);
  const [customization, setCustomization] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    accentColor: "#3b82f6",
    fontFamily: "Noto Sans Hebrew",
    fontSize: 16,
    imageFitMode: "cover" as "contain" | "cover",
  });
  const [calendarMonths] = useState(generateCalendarMonths());
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load current step
        const savedStep = LocalStorageService.loadCurrentStep();
        if (
          savedStep &&
          ["photos", "dates", "customize", "preview", "export"].includes(
            savedStep
          )
        ) {
          setCurrentStep(
            savedStep as "photos" | "dates" | "customize" | "preview" | "export"
          );
        }

        // Load photos
        const savedPhotos = PhotoStorageService.loadPhotos();
        setPhotos(savedPhotos);

        // Load personal dates
        const savedDates = LocalStorageService.loadPersonalDates();
        setPersonalDates(savedDates);

        // Load customization
        const savedCustomization = LocalStorageService.loadCustomization();
        if (savedCustomization) {
          setCustomization(savedCustomization);
        }

        console.log("Data loaded from localStorage:", {
          step: savedStep,
          photos: savedPhotos.length,
          dates: savedDates.length,
          customization: !!savedCustomization,
        });
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      LocalStorageService.saveCurrentStep(currentStep);
    }
  }, [currentStep, isLoading]);

  useEffect(() => {
    if (!isLoading && photos.length > 0) {
      PhotoStorageService.savePhotos(photos);
    }
  }, [photos, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      LocalStorageService.savePersonalDates(personalDates);
    }
  }, [personalDates, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      LocalStorageService.saveCustomization(customization);
    }
  }, [customization, isLoading]);

  const handlePhotosUpload = (updatedPhotos: Photo[]) => {
    setPhotos(updatedPhotos);
  };

  const handlePersonalDatesUpdate = (dates: PersonalDate[]) => {
    setPersonalDates(dates);
  };

  const handleCustomizationUpdate = (
    newCustomization: typeof customization
  ) => {
    setCustomization(newCustomization);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            טוען את הנתונים...
          </div>
          <div className="text-gray-600">
            אנא המתן בזמן שאנו טוענים את הפרויקט שלך
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              יוצר לוח השנה האישי
            </h1>
            <div className="flex items-center space-x-4">
              <StorageIndicator />
              <div className="text-sm text-gray-600">
                הנתונים נשמרים אוטומטית
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    confirm(
                      "האם אתה בטוח שברצונך למחוק את כל הנתונים ולהתחיל מחדש?"
                    )
                  ) {
                    LocalStorageService.clearAll();
                    PhotoStorageService.clearPhotos();
                    setPhotos([]);
                    setPersonalDates([]);
                    setCurrentStep("photos");
                    setCustomization({
                      backgroundColor: "#ffffff",
                      textColor: "#000000",
                      accentColor: "#3b82f6",
                      fontFamily: "Noto Sans Hebrew",
                      fontSize: 16,
                      imageFitMode: "cover",
                    });
                  }
                }}
              >
                התחל מחדש
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={currentStep}
          onValueChange={(value) =>
            setCurrentStep(
              value as "photos" | "dates" | "customize" | "preview" | "export"
            )
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8" dir="rtl">
            <TabsTrigger value="photos">העלאת תמונות</TabsTrigger>
            <TabsTrigger value="dates">תאריכים אישיים</TabsTrigger>
            <TabsTrigger value="customize">התאמה אישית</TabsTrigger>
            <TabsTrigger value="preview">תצוגה מקדימה</TabsTrigger>
            <TabsTrigger value="export">ייצוא</TabsTrigger>
          </TabsList>

          <TabsContent value="photos">
            <PhotoUpload
              photos={photos}
              onPhotosUpdate={handlePhotosUpload}
              onNext={() => setCurrentStep("dates")}
            />
          </TabsContent>

          <TabsContent value="dates">
            <PersonalDates
              dates={personalDates}
              onDatesUpdate={handlePersonalDatesUpdate}
              onNext={() => setCurrentStep("customize")}
              onBack={() => setCurrentStep("photos")}
            />
          </TabsContent>

          <TabsContent value="customize">
            <CustomizationPanel
              customization={customization}
              onCustomizationUpdate={handleCustomizationUpdate}
              onNext={() => setCurrentStep("preview")}
              onBack={() => setCurrentStep("dates")}
            />
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">תצוגה מקדימה</h2>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("customize")}
                  >
                    חזור
                  </Button>
                  <Button onClick={() => setCurrentStep("export")}>
                    המשך לייצוא
                  </Button>
                </div>
              </div>
              <Calendar
                months={calendarMonths}
                photos={photos}
                personalDates={personalDates}
                customization={customization}
              />
            </div>
          </TabsContent>

          <TabsContent value="export">
            <ExportPanel
              months={calendarMonths}
              photos={photos}
              personalDates={personalDates}
              customization={customization}
              onBack={() => setCurrentStep("preview")}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
