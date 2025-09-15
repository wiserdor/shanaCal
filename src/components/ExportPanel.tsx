import { useState } from "react";
import type { Photo, PersonalDate, Customization } from "../types";
import { downloadPDF } from "../lib/utils";
import { photoCollageService } from "../services/photoCollage";
import { hebrewCalendarService } from "../services/hebrewCalendar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ExportPanelProps {
  months: Date[];
  photos: Photo[];
  personalDates: PersonalDate[];
  customization: Customization;
  onBack: () => void;
}

export function ExportPanel({
  months,
  photos,
  personalDates,
  customization,
  onBack,
}: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a3",
      });

      // A3 dimensions in mm
      const pageWidth = 420;
      const pageHeight = 297;

      // Calculate photos per month for equal distribution
      const basePhotosPerMonth = Math.floor(photos.length / months.length);
      const extraPhotos = photos.length % months.length;
      const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5); // Shuffle all photos once

      for (let i = 0; i < months.length; i++) {
        setExportProgress((i / months.length) * 100);

        // Generate collage for this month
        let collageDataUrl = "";
        if (photos.length > 0) {
          try {
            // Calculate how many photos this month should get
            const photosForThisMonth =
              basePhotosPerMonth + (i < extraPhotos ? 1 : 0);

            // Select photos for this month (equal distribution, no repetition)
            const startIndex =
              i * basePhotosPerMonth + Math.min(i, extraPhotos);
            const endIndex = startIndex + photosForThisMonth;
            const monthPhotos = shuffledPhotos.slice(startIndex, endIndex);

            console.log(
              `Month ${i + 1}: ${photosForThisMonth} photos (${startIndex}-${
                endIndex - 1
              })`
            );

            // Shuffle the photos for this specific month to create variety
            const shuffledMonthPhotos = monthPhotos.sort(
              () => Math.random() - 0.5
            );

            const collage = await photoCollageService.createRandomCollage(
              shuffledMonthPhotos,
              1200,
              1000,
              customization.imageFitMode
            );
            collageDataUrl = collage;
          } catch (error) {
            console.error("Error generating collage for month", i, error);
          }
        }

        // Create a temporary div for this month
        const tempDiv = document.createElement("div");
        tempDiv.style.width = "1200px";
        tempDiv.style.height = "800px";
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        tempDiv.style.top = "0";
        tempDiv.style.direction = "rtl";

        // Add month content
        const month = months[i];
        const monthName = new Intl.DateTimeFormat("he-IL", {
          year: "numeric",
          month: "long",
        }).format(month);

        // Get Hebrew month and year using API
        let hebrewMonthYear = "תשרי תשפ״ה"; // Default fallback

        try {
          const hebrewDate = await hebrewCalendarService.getHebrewDate(month);
          if (hebrewDate) {
            hebrewMonthYear = `${hebrewDate.hebrewMonthName} ${hebrewDate.hebrewYearTraditional}`;
            console.log("Debug - API Hebrew date:", hebrewDate);
          } else {
            console.warn("Failed to get Hebrew date from API, using fallback");
          }
        } catch (error) {
          console.error("Error fetching Hebrew date:", error);
          // Fallback to approximate Hebrew months
          const monthIndex = month.getMonth();
          const hebrewMonths = [
            "תשרי",
            "חשון",
            "כסלו",
            "טבת",
            "שבט",
            "אדר",
            "ניסן",
            "אייר",
            "סיון",
            "תמוז",
            "אב",
            "אלול",
          ];
          const fallbackMonth = hebrewMonths[monthIndex] || "תשרי";
          hebrewMonthYear = `${fallbackMonth} תשפ״ה`;
        }

        console.log("Debug - Final hebrewMonthYear:", hebrewMonthYear);
        console.log("Debug - Customization colors:", {
          backgroundColor: customization.backgroundColor,
          textColor: customization.textColor,
          accentColor: customization.accentColor,
          fontFamily: customization.fontFamily,
          fontSize: customization.fontSize
        });

        const collageHTML = collageDataUrl
          ? `<img src="${collageDataUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); image-rendering: high-quality; image-rendering: -webkit-optimize-contrast;" alt="קולאז' תמונות" />`
          : photos.length > 0
          ? `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 16px; box-shadow: 0 8px 16px rgba(0,0,0,0.15);">
                 שגיאה ביצירת קולאז'
               </div>`
          : `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15);"></div>`;

        tempDiv.innerHTML = `
          <div style="display: flex; flex-direction: column; height: 100%; gap: 30px; background-color: ${customization.backgroundColor}; color: ${customization.textColor}; font-family: ${customization.fontFamily}; font-size: ${customization.fontSize}px; padding: 40px;">
            <!-- Title Section -->
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: ${
                customization.accentColor
              }; font-size: 32px; margin-bottom: 10px; font-weight: bold;">
                ${monthName}
              </h1>
              <p style="font-size: 16px; opacity: 0.8; color: ${customization.textColor};">
                ${hebrewMonthYear}
              </p>
            </div>
            
            <!-- Content Section: Collage and Calendar -->
            <div style="display: flex; flex: 1; gap: 40px; align-items: stretch; min-height: 600px;">
              <!-- Photo Collage Section -->
              <div style="flex: 1; display: flex; flex-direction: column; height: 100%;">
                <div style="width: 100%; height: 100%; display: flex; flex: 1; min-height: 600px;">
                  ${collageHTML}
                </div>
              </div>
              
              <!-- Calendar Section -->
              <div style="flex: 2; display: flex; flex-direction: column; align-self: flex-start;">
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                  ${await generateCalendarHTML(
                    month,
                    personalDates,
                    customization
                  )}
                </div>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(tempDiv);

        // Convert to canvas
        const canvas = await html2canvas(tempDiv, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null, // Transparent background
          logging: false, // Disable console logging
          imageTimeout: 15000, // Increase timeout for high-res images
        });

        document.body.removeChild(tempDiv);

        // Add page to PDF
        if (i > 0) {
          pdf.addPage();
        }

        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
      }

      setExportProgress(100);

      // Download PDF
      const pdfBlob = pdf.output("blob");
      downloadPDF(pdfBlob, `לוח-שנה-אישי-${new Date().getFullYear()}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("שגיאה בייצוא הקובץ. אנא נסה שוב.");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const generateCalendarHTML = async (
    month: Date,
    personalDates: PersonalDate[],
    customization: Customization
  ) => {
    const daysInMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    ).getDay();
    const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

    // Calculate number of weeks needed for this month
    const totalCells = firstDay + daysInMonth;
    const weeksNeeded = Math.ceil(totalCells / 7);

    // Adjust cell height based on number of weeks
    const cellHeight = weeksNeeded === 6 ? "85px" : "100px";

    // Load Hebrew holidays for this month
    let monthHolidays: { date: string; title: string }[] = [];
    try {
      monthHolidays = await hebrewCalendarService.getHolidays(
        month.getFullYear(),
        month.getMonth() + 1
      );
    } catch {
      // Use fallback data
      monthHolidays = hebrewCalendarService.getFallbackHolidays(
        month.getFullYear(),
        month.getMonth() + 1
      );
    }

    let html = "";

    // Day headers
    dayNames.forEach((day) => {
      html += `
        <div style="background: ${customization.accentColor}; color: white; padding: 8px; text-align: center; font-weight: bold; font-size: 12px;">
          ${day}
        </div>
      `;
    });

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      html += `<div style="height: ${cellHeight}; border: 1px solid #eee;"></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const personalDatesForDay = personalDates.filter(
        (pd) =>
          pd.date.getDate() === day &&
          pd.date.getMonth() === month.getMonth() &&
          pd.date.getFullYear() === month.getFullYear()
      );

      // Get Hebrew holidays for this day
      const dateStr = new Date(month.getFullYear(), month.getMonth(), day)
        .toISOString()
        .split("T")[0];
      const holidaysForDay = monthHolidays.filter(
        (holiday) => holiday.date === dateStr
      );

      html += `
        <div style="height: ${cellHeight}; border: 1px solid #eee; padding: 4px; position: relative; display: flex; flex-direction: column;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 2px; flex-shrink: 0;">${day}</div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 1px; overflow: visible; min-height: 0;">
            ${personalDatesForDay
              .map(
                (pd) => `
              <div style="background: #e3f2fd; color: #1976d2; font-size: 8px; padding: 2px 4px; border-radius: 2px; line-height: 1.1; word-wrap: break-word; overflow-wrap: break-word; hyphens: auto; white-space: normal; max-width: 100%; text-align: center; direction: rtl;" title="${pd.title}">
                ${pd.title}
              </div>
            `
              )
              .join("")}
            ${holidaysForDay
              .map(
                (holiday) => `
              <div style="background: #ffebee; color: #c62828; font-size: 8px; padding: 2px 4px; border-radius: 2px; line-height: 1.1; word-wrap: break-word; overflow-wrap: break-word; hyphens: auto; white-space: normal; max-width: 100%; text-align: center; direction: rtl;" title="${holiday.title}">
                ${holiday.title}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    return html;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">ייצוא לוח השנה</h2>
        <p className="text-muted-foreground">
          ייצא את לוח השנה כקובץ PDF באיכות גבוהה להדפסה על נייר A3
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>אפשרויות ייצוא</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">פורמט PDF</div>
                    <div className="text-sm text-muted-foreground">
                      איכות גבוהה להדפסה
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">A3</div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">מספר עמודים</div>
                    <div className="text-sm text-muted-foreground">
                      חודש אחד לכל עמוד
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {months.length}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">תמונות</div>
                    <div className="text-sm text-muted-foreground">
                      {photos.length > 0
                        ? `תמונות יחולקו שווה בין ${months.length} חודשים`
                        : "אין תמונות זמינות"}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {photos.length > 0
                      ? `${Math.max(
                          1,
                          Math.floor(photos.length / months.length)
                        )} תמונות לחודש`
                      : "0"}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">כיוון הדפסה</div>
                    <div className="text-sm text-muted-foreground">
                      רוחב (Landscape)
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">✓</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הגדרות הדפסה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>גודל נייר:</span>
                  <span className="font-medium">A3 (297 × 420 מ"מ)</span>
                </div>
                <div className="flex justify-between">
                  <span>כיוון:</span>
                  <span className="font-medium">רוחב</span>
                </div>
                <div className="flex justify-between">
                  <span>שוליים:</span>
                  <span className="font-medium">מינימליים</span>
                </div>
                <div className="flex justify-between">
                  <span>איכות:</span>
                  <span className="font-medium">גבוהה (300 DPI)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Export */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>תצוגה מקדימה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg p-4 bg-muted/50">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="font-medium">קובץ PDF</div>
                  <div className="text-sm">
                    {months.length} עמודים • A3 • איכות גבוהה
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ייצוא</CardTitle>
            </CardHeader>
            <CardContent>
              {isExporting ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-medium mb-2">
                      מייצא את לוח השנה...
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                    <div className="text-sm text-muted-foreground mt-2">
                      {Math.round(exportProgress)}% הושלם
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleExportPDF}
                    className="w-full"
                    size="lg"
                  >
                    ייצא ל-PDF
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    הקובץ יורד אוטומטית למחשב שלך
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">הוראות הדפסה</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• ודא שהמדפסת תומכת בנייר A3</li>
            <li>• בחר "התאם לעמוד" בהגדרות ההדפסה</li>
            <li>• השתמש בנייר איכותי (120-150 גרם)</li>
            <li>• בדוק את איכות ההדפסה לפני הדפסת כל העותקים</li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isExporting}>
          חזור
        </Button>
      </div>
    </div>
  );
}
