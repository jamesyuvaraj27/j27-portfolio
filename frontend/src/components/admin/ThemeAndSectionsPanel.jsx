import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";

import api from "../../lib/axios";
import { Button, Card, Input, Label } from "../ui";

const COLOR_FIELDS = [
  ["primaryColor", "Primary Color"],
  ["accentColor", "Accent Color"],
  ["backgroundColor", "Background Color"],
];

const ThemeAndSectionsPanel = () => {
  const [theme, setTheme] = useState(null);
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/admin/theme").then((res) => setTheme(res.data));
    api.get("/admin/sections").then((res) => setSections(res.data));
  };

  useEffect(load, []);

  const saveTheme = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await api.put("/admin/theme", theme);
    setTheme(res.data);
    setSaving(false);
  };

  const toggleSection = async (key, enabled) => {
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, enabled } : s)));
    await api.put(`/admin/sections/${key}`, { enabled });
  };

  if (!theme) return <p className="text-sm text-text-secondary">Loading...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Theme</h2>
        <form onSubmit={saveTheme} className="grid gap-4 sm:grid-cols-3">
          {COLOR_FIELDS.map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme[key]} onChange={(e) => setTheme({ ...theme, [key]: e.target.value })} className="h-9 w-9 rounded border border-border bg-transparent" />
                <Input value={theme[key]} onChange={(e) => setTheme({ ...theme, [key]: e.target.value })} />
              </div>
            </div>
          ))}
          <div className="sm:col-span-3">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Theme"}</Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="mb-1 text-lg font-semibold">Sections</h2>
        <p className="mb-4 text-sm text-text-secondary">Turn public sections on or off without touching code.</p>
        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.key} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-text-secondary/50" />
                <span>{section.label}</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={(e) => toggleSection(section.key, e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-surface-hover peer-checked:bg-primary transition-colors" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ThemeAndSectionsPanel;
