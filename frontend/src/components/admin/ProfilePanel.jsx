import { useEffect, useState } from "react";

import api from "../../lib/axios";
import { mediaUrl } from "../../lib/utils";
import { Button, Card, Input, Label, Textarea } from "../ui";

const TEXT_FIELDS = [
  ["brand", "Brand"],
  ["fullName", "Full Name"],
  ["role", "Role"],
  ["tagline", "Tagline"],
  ["availability", "Availability"],
  ["location", "Location"],
  ["email", "Email"],
  ["phone", "Phone"],
];

const TEXTAREA_FIELDS = [
  ["valueProposition", "Value Proposition"],
  ["summary", "Summary"],
  ["aboutIntro", "About — Intro"],
  ["aboutJourney", "About — Journey"],
  ["aboutFocus", "About — Focus"],
  ["aboutMindset", "About — Mindset"],
  ["aboutGoals", "About — Goals"],
];

const ProfilePanel = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [skillBadges, setSkillBadges] = useState("");
  const [strengths, setStrengths] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/admin/profile").then((res) => {
      setProfile(res.data);
      setForm(res.data);
      setSkillBadges((res.data.skillBadges || []).join(", "));
      setStrengths((res.data.strengths || []).join(", "));
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (["id", "avatarUrl", "avatarPublicId", "updatedAt", "socialLinks", "skillBadges", "strengths"].includes(key)) return;
        fd.append(key, value ?? "");
      });
      fd.append("skillBadges", skillBadges);
      fd.append("strengths", strengths);
      fd.append("socialLinks", JSON.stringify(form.socialLinks || []));
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await api.put("/admin/profile", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile(res.data);
      setStatus("Saved.");
    } catch {
      setStatus("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="text-sm text-text-secondary">Loading...</p>;

  return (
    <Card>
      <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center gap-4">
          {profile.avatarUrl && <img src={mediaUrl(profile.avatarUrl)} alt="" className="h-16 w-16 rounded-full object-cover" />}
          <div>
            <Label>Avatar</Label>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="text-sm text-text-secondary" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT_FIELDS.map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
        </div>

        {TEXTAREA_FIELDS.map(([key, label]) => (
          <div key={key}>
            <Label>{label}</Label>
            <Textarea value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}

        <div>
          <Label>Skill Badges (comma separated)</Label>
          <Input value={skillBadges} onChange={(e) => setSkillBadges(e.target.value)} />
        </div>
        <div>
          <Label>Strengths (comma separated)</Label>
          <Input value={strengths} onChange={(e) => setStrengths(e.target.value)} />
        </div>

        {status && <p className="text-sm text-text-secondary">{status}</p>}
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
      </form>
    </Card>
  );
};

export default ProfilePanel;
