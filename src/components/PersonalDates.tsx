import { useState } from "react";
import type { PersonalDate } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalDatesProps {
  dates: PersonalDate[];
  onDatesUpdate: (dates: PersonalDate[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PersonalDates({
  dates,
  onDatesUpdate,
  onNext,
  onBack,
}: PersonalDatesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState({
    title: "",
    date: "",
    type: "birthday" as PersonalDate["type"],
    description: "",
  });

  const handleAddDate = () => {
    if (!newDate.title || !newDate.date) return;

    const personalDate: PersonalDate = {
      id: `${Date.now()}`,
      title: newDate.title,
      date: new Date(newDate.date),
      type: newDate.type,
      description: newDate.description || undefined,
    };

    onDatesUpdate([...dates, personalDate]);
    setNewDate({ title: "", date: "", type: "birthday", description: "" });
    setIsAdding(false);
  };

  const handleRemoveDate = (id: string) => {
    onDatesUpdate(dates.filter((date) => date.id !== id));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getTypeLabel = (type: PersonalDate["type"]) => {
    switch (type) {
      case "birthday":
        return "יום הולדת";
      case "anniversary":
        return "יום נישואין";
      case "holiday":
        return "חג";
      case "other":
        return "אחר";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">תאריכים אישיים</h2>
        <p className="text-muted-foreground">
          הוסף תאריכים חשובים שיופיעו בלוח השנה
        </p>
      </div>

      {/* Add New Date Form */}
      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>הוסף תאריך חדש</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">כותרת</Label>
                <Input
                  id="title"
                  type="text"
                  value={newDate.title}
                  onChange={(e) =>
                    setNewDate({ ...newDate, title: e.target.value })
                  }
                  placeholder="לדוגמה: יום הולדת של אמא"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">תאריך</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDate.date}
                  onChange={(e) =>
                    setNewDate({ ...newDate, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">סוג</Label>
                <Select
                  value={newDate.type}
                  onValueChange={(value) =>
                    setNewDate({
                      ...newDate,
                      type: value as PersonalDate["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">יום הולדת</SelectItem>
                    <SelectItem value="anniversary">יום נישואין</SelectItem>
                    <SelectItem value="holiday">חג</SelectItem>
                    <SelectItem value="other">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">תיאור (אופציונלי)</Label>
                <Input
                  id="description"
                  type="text"
                  value={newDate.description}
                  onChange={(e) =>
                    setNewDate({ ...newDate, description: e.target.value })
                  }
                  placeholder="תיאור נוסף"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                ביטול
              </Button>
              <Button onClick={handleAddDate}>הוסף</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full py-4 border-2 border-dashed"
        >
          + הוסף תאריך חדש
        </Button>
      )}

      {/* Dates List */}
      {dates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>תאריכים נבחרים ({dates.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dates.map((date) => (
                <div
                  key={date.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{date.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(date.date)} • {getTypeLabel(date.type)}
                    </div>
                    {date.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {date.description}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveDate(date.id)}
                  >
                    מחק
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          חזור
        </Button>
        <Button onClick={onNext}>המשך</Button>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">הוראות</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• התאריכים יופיעו בלוח השנה עם סימון מיוחד</li>
            <li>• ניתן להוסיף ימי הולדת, ימי נישואין, חגים ועוד</li>
            <li>• התאריכים יוצגו בעברית עם תאריך עברי וגרגוריאני</li>
            <li>• ניתן לערוך או למחוק תאריכים בכל עת</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
