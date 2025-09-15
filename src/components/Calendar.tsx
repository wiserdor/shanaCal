import { useState, useEffect } from "react";
import type { Photo, PersonalDate, Customization } from "../types";
import { hebrewCalendarService } from "../services/hebrewCalendar";
import { photoCollageService } from "../services/photoCollage";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getHebrewMonthName,
} from "../lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarProps {
  months: Date[];
  photos: Photo[];
  personalDates: PersonalDate[];
  customization: Customization;
}

export function Calendar({
  months,
  photos,
  personalDates,
  customization,
}: CalendarProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [hebrewHolidays, setHebrewHolidays] = useState<{
    [key: string]: any[];
  }>({});
  const [collages, setCollages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load Hebrew holidays for all months
    const loadHolidays = async () => {
      const holidays: { [key: string]: any[] } = {};

      for (const month of months) {
        const key = `${month.getFullYear()}-${month.getMonth() + 1}`;
        try {
          const monthHolidays = await hebrewCalendarService.getHolidays(
            month.getFullYear(),
            month.getMonth() + 1
          );
          holidays[key] = monthHolidays;
        } catch (error) {
          // Use fallback data
          holidays[key] = hebrewCalendarService.getFallbackHolidays(
            month.getFullYear(),
            month.getMonth() + 1
          );
        }
      }

      setHebrewHolidays(holidays);
    };

    loadHolidays();
  }, [months]);

  useEffect(() => {
    // Generate collages for each month
    const generateCollages = async () => {
      const newCollages: { [key: string]: string } = {};

      for (let i = 0; i < months.length; i++) {
        const month = months[i];
        const key = `${month.getFullYear()}-${month.getMonth() + 1}`;

        if (photos.length > 0) {
          try {
            // Select photos for this month (cycle through available photos)
            const monthPhotos = photos.slice(
              i % photos.length,
              (i % photos.length) + Math.min(8, photos.length)
            );
            const collage = await photoCollageService.createRandomCollage(
              monthPhotos,
              400,
              300
            );
            newCollages[key] = collage;
          } catch (error) {
            console.error("Error generating collage:", error);
          }
        }
      }

      setCollages(newCollages);
    };

    generateCollages();
  }, [months, photos]);

  const currentMonth = months[currentMonthIndex];
  const monthKey = `${currentMonth.getFullYear()}-${
    currentMonth.getMonth() + 1
  }`;
  const monthHolidays = hebrewHolidays[monthKey] || [];
  const monthCollage = collages[monthKey];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = getHebrewMonthName(currentMonth.getMonth() + 1);

  const getPersonalDatesForDay = (day: number) => {
    // const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return personalDates.filter(
      (pd) =>
        pd.date.getDate() === day &&
        pd.date.getMonth() === currentMonth.getMonth() &&
        pd.date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const getHolidaysForDay = (day: number) => {
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    return monthHolidays.filter((holiday) => holiday.date === dateStr);
  };

  const renderCalendarGrid = () => {
    const days = [];
    const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

    // Add day headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={`header-${i}`}
          className="text-center font-bold text-sm py-2 border-b"
        >
          {dayNames[i]}
        </div>
      );
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 border-b border-r"></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const personalDatesForDay = getPersonalDatesForDay(day);
      const holidaysForDay = getHolidaysForDay(day);

      days.push(
        <div key={day} className="h-16 border-b border-r p-1 relative">
          <div className="text-sm font-medium">{day}</div>

          {/* Personal dates */}
          {personalDatesForDay.map((pd) => (
            <div
              key={pd.id}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1 truncate text-center"
              style={{ direction: "rtl" }}
              title={pd.title}
            >
              {pd.title}
            </div>
          ))}

          {/* Hebrew holidays */}
          {holidaysForDay.map((holiday, index) => (
            <div
              key={index}
              className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded mb-1 truncate text-center"
              style={{ direction: "rtl" }}
              title={holiday.title}
            >
              {holiday.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() =>
            setCurrentMonthIndex(Math.max(0, currentMonthIndex - 1))
          }
          disabled={currentMonthIndex === 0}
        >
          חודש קודם
        </Button>

        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {monthName} {currentMonth.getFullYear()}
          </h2>
          <p className="text-sm text-muted-foreground">
            {currentMonthIndex + 1} מתוך {months.length}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentMonthIndex(
              Math.min(months.length - 1, currentMonthIndex + 1)
            )
          }
          disabled={currentMonthIndex === months.length - 1}
        >
          חודש הבא
        </Button>
      </div>

      {/* Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo Collage */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>קולאז' תמונות</CardTitle>
            </CardHeader>
            <CardContent>
              {monthCollage ? (
                <img
                  src={monthCollage}
                  alt={`קולאז' לחודש ${monthName}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  אין תמונות זמינות
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card
            style={{
              backgroundColor: customization.backgroundColor,
              color: customization.textColor,
              fontFamily: customization.fontFamily,
              fontSize: `${customization.fontSize}px`,
            }}
          >
            <CardContent className="p-6">
              <div
                className="text-center mb-6"
                style={{ color: customization.accentColor }}
              >
                <h3 className="text-xl font-bold mb-2">
                  {monthName} {currentMonth.getFullYear()}
                </h3>
                <p className="text-sm opacity-75">
                  {new Intl.DateTimeFormat("he-IL", {
                    year: "numeric",
                    month: "long",
                  }).format(currentMonth)}
                </p>
              </div>

              <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
                {renderCalendarGrid()}
              </div>

              {/* Legend */}
              <div className="mt-4 flex justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-100 rounded"></div>
                  <span>תאריכים אישיים</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 rounded"></div>
                  <span>חגים עבריים</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Month Thumbnails */}
      <Card>
        <CardHeader>
          <CardTitle>כל החודשים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {months.map((month, index) => (
              <Button
                key={index}
                variant={index === currentMonthIndex ? "default" : "outline"}
                onClick={() => setCurrentMonthIndex(index)}
                className="p-2 h-auto flex flex-col"
              >
                <div className="text-sm font-medium">
                  {getHebrewMonthName(month.getMonth() + 1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {month.getFullYear()}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
