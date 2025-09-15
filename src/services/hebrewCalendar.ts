export interface HebrewHoliday {
  title: string;
  date: string;
  category: "holiday" | "fast" | "rosh_chodesh";
}

export interface HebrewDate {
  hebrew: string;
  gregorian: string;
  month: number;
  day: number;
  year: number;
  hebrewMonthName: string;
  hebrewYear: string;
  hebrewYearTraditional: string;
}

class HebrewCalendarService {
  private baseUrl = "https://www.hebcal.com/hebcal";
  private converterUrl = "https://www.hebcal.com/converter";

  async getHolidays(year: number, month: number): Promise<HebrewHoliday[]> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];

      const response = await fetch(
        `${this.baseUrl}?v=1&cfg=json&year=${year}&month=${month}&maj=on&min=on&mod=on&nx=on&ss=on&mf=on&c=on&geo=none&lg=he&start=${startStr}&end=${endStr}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Hebrew calendar data");
      }

      const data = await response.json();

      return (
        data.items?.map((item: any) => ({
          title: item.title,
          date: item.date,
          category: this.getCategory(item.category),
        })) || []
      );
    } catch (error) {
      console.error("Error fetching Hebrew holidays:", error);
      return [];
    }
  }

  async getHebrewDate(gregorianDate: Date): Promise<HebrewDate | null> {
    try {
      const dateStr = gregorianDate.toISOString().split("T")[0];
      const response = await fetch(
        `${this.converterUrl}?cfg=json&gy=${gregorianDate.getFullYear()}&gm=${
          gregorianDate.getMonth() + 1
        }&gd=${gregorianDate.getDate()}&g2h=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Hebrew date");
      }

      const data = await response.json();

      if (data.heDateParts) {
        const hebrewYear = data.hy.toString();
        const hebrewMonthName = data.heDateParts.m;
        const hebrewYearTraditional = data.heDateParts.y;

        return {
          hebrew: data.hebrew,
          gregorian: dateStr,
          month: data.hm === "Elul" ? 12 : this.getHebrewMonthNumber(data.hm),
          day: data.hd,
          year: data.hy,
          hebrewMonthName,
          hebrewYear,
          hebrewYearTraditional,
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching Hebrew date:", error);
      return null;
    }
  }

  private getCategory(category: string): "holiday" | "fast" | "rosh_chodesh" {
    switch (category) {
      case "holiday":
        return "holiday";
      case "fast":
        return "fast";
      case "roshchodesh":
        return "rosh_chodesh";
      default:
        return "holiday";
    }
  }

  private getHebrewMonthNumber(monthName: string): number {
    const hebrewMonths: { [key: string]: number } = {
      Tishrei: 1,
      Cheshvan: 2,
      Kislev: 3,
      Tevet: 4,
      Shevat: 5,
      Adar: 6,
      Nisan: 7,
      Iyyar: 8,
      Sivan: 9,
      Tamuz: 10,
      Av: 11,
      Elul: 12,
      "Adar II": 13, // Adar II in leap years
    };
    return hebrewMonths[monthName] || 1;
  }

  // Fallback data for when API is unavailable
  getFallbackHolidays(year: number, month: number): HebrewHoliday[] {
    const fallbackHolidays: { [key: string]: HebrewHoliday[] } = {
      "2025-9": [
        // September 2025
        { title: "ראש השנה", date: "2025-09-22", category: "holiday" },
        { title: "יום כיפור", date: "2025-10-01", category: "holiday" },
        { title: "סוכות", date: "2025-10-06", category: "holiday" },
        { title: "ליל סליחות", date: "2025-09-14", category: "holiday" },
      ],
      "2025-10": [
        // October 2025
        { title: "שמיני עצרת", date: "2025-10-13", category: "holiday" },
        { title: "שמחת תורה", date: "2025-10-14", category: "holiday" },
        { title: "ערב ראש השנה", date: "2025-09-21", category: "holiday" },
        { title: "ערב יום כיפור", date: "2025-09-30", category: "holiday" },
        { title: "ערב סוכות", date: "2025-10-05", category: "holiday" },
        { title: "ערב שמיני עצרת", date: "2025-10-12", category: "holiday" },
        { title: "ערב שמחת תורה", date: "2025-10-13", category: "holiday" },
        { title: "צום גדליה", date: "2025-09-26", category: "fast" },
        { title: "שבת שובה", date: "2025-09-28", category: "holiday" },
      ],
      "2025-12": [
        // December 2025
        { title: "חנוכה", date: "2025-12-25", category: "holiday" },
        { title: "עשרה בטבת", date: "2025-12-30", category: "fast" },
      ],
      "2026-1": [
        // January 2026
        { title: "טו בשבט", date: "2026-01-25", category: "holiday" },
      ],
      "2026-3": [
        // March 2026
        { title: "פורים", date: "2026-03-13", category: "holiday" },
        { title: "תענית אסתר", date: "2026-03-12", category: "fast" },
        { title: "ערב פורים", date: "2026-03-12", category: "holiday" },
      ],
      "2026-4": [
        // April 2026
        { title: "פסח", date: "2026-04-22", category: "holiday" },
        { title: "ערב פסח", date: "2026-04-21", category: "holiday" },
        { title: "תענית בכורות", date: "2026-04-21", category: "fast" },
        { title: "חול המועד פסח", date: "2026-04-23", category: "holiday" },
        { title: "שבת הגדול", date: "2026-04-19", category: "holiday" },
      ],
      "2026-5": [
        // May 2026
        { title: "יום העצמאות", date: "2026-05-01", category: "holiday" },
        { title: "שבועות", date: "2026-05-11", category: "holiday" },
        { title: "ערב שבועות", date: "2026-05-10", category: "holiday" },
        { title: "יום השואה", date: "2026-04-28", category: "holiday" },
        { title: "יום הזכרון", date: "2026-04-30", category: "holiday" },
        { title: "לג בעומר", date: "2026-05-16", category: "holiday" },
      ],
      "2026-7": [
        // July 2026
        { title: "תשעה באב", date: "2026-07-26", category: "fast" },
        { title: "ערב תשעה באב", date: "2026-07-25", category: "holiday" },
      ],
    };

    const key = `${year}-${month}`;
    return fallbackHolidays[key] || [];
  }
}

export const hebrewCalendarService = new HebrewCalendarService();
