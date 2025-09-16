export interface Photo {
  id: string;
  file: File;
  url: string;
  name: string;
}

export interface PersonalDate {
  id: string;
  title: string;
  date: Date;
  type: "birthday" | "anniversary" | "holiday" | "other";
  description?: string;
}

export interface Customization {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  imageFitMode: "contain" | "cover";
  alternatingLayout: boolean;
}

export interface CalendarProject {
  id: string;
  name: string;
  photos: Photo[];
  personalDates: PersonalDate[];
  customization: Customization;
  createdAt: Date;
  updatedAt: Date;
}

export interface HebrewHoliday {
  title: string;
  date: string;
  category: "holiday" | "fast" | "rosh_chodesh";
}

export interface CalendarMonth {
  date: Date;
  hebrewHolidays: HebrewHoliday[];
  collageUrl?: string;
}
