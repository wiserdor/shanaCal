import { useState } from "react";
import type { Customization } from "../types";
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

interface CustomizationPanelProps {
  customization: Customization;
  onCustomizationUpdate: (customization: Customization) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CustomizationPanel({
  customization,
  onCustomizationUpdate,
  onNext,
  onBack,
}: CustomizationPanelProps) {
  const [localCustomization, setLocalCustomization] = useState(customization);

  const handleColorChange = (field: keyof Customization, value: string) => {
    const updated = { ...localCustomization, [field]: value };
    setLocalCustomization(updated);
    onCustomizationUpdate(updated);
  };

  const handleFontSizeChange = (value: number) => {
    const updated = { ...localCustomization, fontSize: value };
    setLocalCustomization(updated);
    onCustomizationUpdate(updated);
  };

  const presetThemes = [
    {
      name: "קלאסי",
      colors: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        accentColor: "#3b82f6",
      },
    },
    {
      name: "חם",
      colors: {
        backgroundColor: "#fef3c7",
        textColor: "#92400e",
        accentColor: "#f59e0b",
      },
    },
    {
      name: "קר",
      colors: {
        backgroundColor: "#dbeafe",
        textColor: "#1e40af",
        accentColor: "#3b82f6",
      },
    },
    {
      name: "טבעי",
      colors: {
        backgroundColor: "#f0fdf4",
        textColor: "#166534",
        accentColor: "#22c55e",
      },
    },
    {
      name: "רומנטי",
      colors: {
        backgroundColor: "#fdf2f8",
        textColor: "#be185d",
        accentColor: "#ec4899",
      },
    },
  ];

  const applyPreset = (preset: (typeof presetThemes)[0]) => {
    const updated = {
      ...localCustomization,
      ...preset.colors,
    };
    setLocalCustomization(updated);
    onCustomizationUpdate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">התאמה אישית</h2>
        <p className="text-muted-foreground">
          התאם את הצבעים, הגופנים והעיצוב של לוח השנה
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>צבעים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">צבע רקע</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      id="bg-color"
                      type="color"
                      value={localCustomization.backgroundColor}
                      onChange={(e) =>
                        handleColorChange("backgroundColor", e.target.value)
                      }
                      className="w-12 h-10 border border-input rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={localCustomization.backgroundColor}
                      onChange={(e) =>
                        handleColorChange("backgroundColor", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text-color">צבע טקסט</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      id="text-color"
                      type="color"
                      value={localCustomization.textColor}
                      onChange={(e) =>
                        handleColorChange("textColor", e.target.value)
                      }
                      className="w-12 h-10 border border-input rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={localCustomization.textColor}
                      onChange={(e) =>
                        handleColorChange("textColor", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">צבע דגש</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      id="accent-color"
                      type="color"
                      value={localCustomization.accentColor}
                      onChange={(e) =>
                        handleColorChange("accentColor", e.target.value)
                      }
                      className="w-12 h-10 border border-input rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={localCustomization.accentColor}
                      onChange={(e) =>
                        handleColorChange("accentColor", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>גופן</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="font-size">גודל גופן</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      id="font-size"
                      type="range"
                      min="12"
                      max="24"
                      value={localCustomization.fontSize}
                      onChange={(e) =>
                        handleFontSizeChange(Number(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-8">
                      {localCustomization.fontSize}px
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-family">משפחת גופן</Label>
                  <Select
                    value={localCustomization.fontFamily}
                    onValueChange={(value) =>
                      handleColorChange("fontFamily", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר גופן" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Noto Sans Hebrew">
                        Noto Sans Hebrew
                      </SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">
                        Times New Roman
                      </SelectItem>
                      <SelectItem value="David">David</SelectItem>
                      <SelectItem value="FrankRuehl">FrankRuehl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-fit-mode">אופן הצגת תמונות</Label>
                  <Select
                    value={localCustomization.imageFitMode}
                    onValueChange={(value: "contain" | "cover") =>
                      handleColorChange("imageFitMode", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר אופן הצגה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">
                        כיסוי מלא (Cover) - תמונות יגזרו אם נדרש
                      </SelectItem>
                      <SelectItem value="contain">
                        התאמה מלאה (Contain) - כל התמונה תוצג
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {localCustomization.imageFitMode === "cover"
                      ? "תמונות ימלאו את כל החלל ויגזרו אם נדרש"
                      : "כל התמונה תוצג במלואה עם שוליים אם נדרש"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>תצוגה מקדימה</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border border-border rounded-lg p-4"
                style={{
                  backgroundColor: localCustomization.backgroundColor,
                  color: localCustomization.textColor,
                  fontFamily: localCustomization.fontFamily,
                  fontSize: `${localCustomization.fontSize}px`,
                }}
              >
                <div className="text-center mb-4">
                  <h4
                    className="font-bold text-lg mb-2"
                    style={{ color: localCustomization.accentColor }}
                  >
                    ספטמבר 2025
                  </h4>
                  <div className="text-sm opacity-75">תשרי תשפ"ו</div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-xs">
                  {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((day) => (
                    <div
                      key={day}
                      className="text-center p-1 font-medium"
                      style={{ color: localCustomization.accentColor }}
                    >
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => (
                    <div key={i} className="text-center p-1">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ערכות צבעים מוכנות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {presetThemes.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    onClick={() => applyPreset(preset)}
                    className="p-3 h-auto flex flex-col items-start"
                  >
                    <div className="flex space-x-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{
                          backgroundColor: preset.colors.backgroundColor,
                        }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: preset.colors.textColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: preset.colors.accentColor }}
                      />
                    </div>
                    <div className="text-sm font-medium">{preset.name}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          חזור
        </Button>
        <Button onClick={onNext}>המשך לתצוגה מקדימה</Button>
      </div>
    </div>
  );
}
