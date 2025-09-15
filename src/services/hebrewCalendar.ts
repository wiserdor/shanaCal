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
        `${this.baseUrl}?v=1&cfg=json&year=${year}&month=${month}&maj=on&min=on&mod=on&nx=on&ss=on&mf=on&c=on&geo=none&start=${startStr}&end=${endStr}`
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
      ],
      "2025-10": [
        // October 2025
        { title: "שמיני עצרת", date: "2025-10-13", category: "holiday" },
        { title: "שמחת תורה", date: "2025-10-14", category: "holiday" },
      ],
      "2025-12": [
        // December 2025
        { title: "חנוכה", date: "2025-12-25", category: "holiday" },
      ],
      "2026-3": [
        // March 2026
        { title: "פורים", date: "2026-03-13", category: "holiday" },
      ],
      "2026-4": [
        // April 2026
        { title: "פסח", date: "2026-04-22", category: "holiday" },
      ],
      "2026-5": [
        // May 2026
        { title: "יום העצמאות", date: "2026-05-01", category: "holiday" },
        { title: "שבועות", date: "2026-05-11", category: "holiday" },
      ],
    };

    const key = `${year}-${month}`;
    return fallbackHolidays[key] || [];
  }
}

export const hebrewCalendarService = new HebrewCalendarService();
