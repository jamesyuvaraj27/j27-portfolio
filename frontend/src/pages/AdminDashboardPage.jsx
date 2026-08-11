import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Award, Briefcase, FileText, GraduationCap, Image, LayoutDashboard,
  LogOut, Mail, MessageSquare, Paperclip, Sparkles, Tag, User, Wrench,
} from "lucide-react";

import { useAdminAuth } from "../lib/useAdminAuth";
import CrudPanel from "../components/admin/CrudPanel";
import ProfilePanel from "../components/admin/ProfilePanel";
import ThemeAndSectionsPanel from "../components/admin/ThemeAndSectionsPanel";
import MessagesPanel from "../components/admin/MessagesPanel";
import AssetsPanel from "../components/admin/AssetsPanel";
import DashboardOverview from "../components/admin/DashboardOverview";

const CTA_OPTIONS = [
  { value: "SUBSCRIBE", label: "Subscribe (capture lead — no payment yet)" },
  { value: "CONTACT", label: "Scroll to Contact" },
  { value: "EXTERNAL_LINK", label: "External link (e.g. payment link)" },
];

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "Personal Info", icon: User },
  { key: "assets", label: "Resume & Logo", icon: Paperclip },
  { key: "services", label: "Services", icon: Wrench },
  { key: "projects", label: "Projects", icon: Briefcase },
  { key: "skills", label: "Skills", icon: Tag },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "certifications", label: "Certificates", icon: Award },
  { key: "testimonials", label: "Testimonials", icon: MessageSquare },
  { key: "gallery", label: "Gallery", icon: Image },
  { key: "pricing", label: "Pricing", icon: Sparkles },
  { key: "blog", label: "Blog", icon: FileText },
  { key: "messages", label: "Contact Messages", icon: Mail },
  { key: "theme", label: "Theme & Sections", icon: LayoutDashboard },
];

const AdminDashboardPage = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const renderPanel = () => {
    switch (active) {
      case "dashboard":
        return <DashboardOverview />;
      case "profile":
        return <ProfilePanel />;
      case "assets":
        return <AssetsPanel />;
      case "theme":
        return <ThemeAndSectionsPanel />;
      case "messages":
        return <MessagesPanel />;

      case "services":
        return (
          <CrudPanel
            title="Services"
            apiPath="/admin/services"
            columns={[{ key: "title", label: "Title" }, { key: "order", label: "Order" }]}
            fields={[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "description", label: "Description", type: "textarea", required: true },
              { name: "icon", label: "Icon (bot / globe / workflow / sparkles)", type: "text" },
              { name: "order", label: "Order", type: "number", default: 0 },
            ]}
          />
        );

      case "projects":
        return (
          <CrudPanel
            title="Projects"
            apiPath="/admin/projects"
            columns={[
              { key: "title", label: "Title" },
              { key: "featured", label: "Featured", render: (i) => (i.featured ? "Yes" : "No") },
            ]}
            fields={[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "description", label: "Description", type: "textarea", required: true },
              { name: "techStack", label: "Tech Stack", type: "tags", required: true },
              { name: "features", label: "Features", type: "tags" },
              { name: "githubLink", label: "GitHub Link", type: "text" },
              { name: "liveLink", label: "Live Link", type: "text" },
              { name: "featured", label: "Featured", type: "checkbox" },
              { name: "order", label: "Order", type: "number", default: 0 },
              { name: "image", label: "Image", type: "file", previewKey: "image" },
            ]}
          />
        );

      case "skills":
        return (
          <CrudPanel
            title="Skills"
            apiPath="/admin/skills"
            columns={[{ key: "name", label: "Name" }, { key: "category", label: "Category" }, { key: "level", label: "Level" }]}
            fields={[
              { name: "name", label: "Name", type: "text", required: true },
              { name: "category", label: "Category", type: "text", required: true },
              { name: "level", label: "Level (1-100)", type: "number", default: 50 },
            ]}
          />
        );

      case "education":
        return (
          <CrudPanel
            title="Education"
            apiPath="/admin/education"
            columns={[{ key: "degree", label: "Degree" }, { key: "institution", label: "Institution" }]}
            fields={[
              { name: "degree", label: "Degree", type: "text", required: true },
              { name: "institution", label: "Institution", type: "text", required: true },
              { name: "duration", label: "Duration", type: "text", required: true },
              { name: "description", label: "Description", type: "textarea" },
              { name: "order", label: "Order", type: "number", default: 0 },
            ]}
          />
        );

      case "experience":
        return (
          <CrudPanel
            title="Experience"
            apiPath="/admin/experience"
            columns={[{ key: "title", label: "Title" }, { key: "company", label: "Company" }]}
            fields={[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "company", label: "Company", type: "text", required: true },
              { name: "duration", label: "Duration", type: "text", required: true },
              { name: "description", label: "Description", type: "textarea", required: true },
              { name: "achievements", label: "Achievements", type: "tags" },
              {
                name: "order",
                label: "Order (lower = earlier in the Journey timeline)",
                type: "number",
                default: 0,
              },
            ]}
          />
        );

      case "certifications":
        return (
          <CrudPanel
            title="Certifications"
            apiPath="/admin/certifications"
            columns={[{ key: "title", label: "Title" }, { key: "issuer", label: "Issuer" }]}
            fields={[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "issuer", label: "Issuer", type: "text", required: true },
              { name: "completionDate", label: "Completion Date", type: "date", required: true },
              { name: "credentialLink", label: "Credential Link", type: "text" },
              { name: "previewFile", label: "Preview (PDF or image)", type: "file", accept: "application/pdf,image/*", previewKey: "previewFile" },
            ]}
          />
        );

      case "testimonials":
        return (
          <CrudPanel
            title="Testimonials"
            apiPath="/admin/testimonials"
            columns={[{ key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "rating", label: "Rating" }]}
            fields={[
              { name: "name", label: "Name", type: "text", required: true },
              { name: "role", label: "Role", type: "text", required: true },
              { name: "message", label: "Message", type: "textarea", required: true },
              { name: "rating", label: "Rating (1-5)", type: "number", default: 5 },
            ]}
          />
        );

      case "gallery":
        return (
          <CrudPanel
            title="Gallery"
            apiPath="/admin/photos"
            columns={[{ key: "title", label: "Title" }, { key: "featured", label: "Featured", render: (i) => (i.featured ? "Yes" : "No") }]}
            fields={[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "description", label: "Description", type: "textarea" },
              { name: "alt", label: "Alt Text", type: "text" },
              { name: "featured", label: "Featured", type: "checkbox" },
              { name: "image", label: "Image", type: "file", previewKey: "image" },
            ]}
          />
        );

      case "pricing":
        return (
          <CrudPanel
            title="Pricing Plans"
            apiPath="/admin/pricing"
            columns={[{ key: "name", label: "Name" }, { key: "price", label: "Price" }, { key: "highlighted", label: "Highlighted", render: (i) => (i.highlighted ? "Yes" : "No") }]}
            fields={[
              { name: "name", label: "Plan Name", type: "text", required: true },
              { name: "price", label: "Price (e.g. $499 or ₹9,999)", type: "text", required: true },
              { name: "billingPeriod", label: "Billing Period (e.g. project, month)", type: "text", default: "one-time" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "features", label: "Features", type: "tags" },
              { name: "highlighted", label: "Highlight this plan", type: "checkbox" },
              { name: "ctaLabel", label: "Button Label", type: "text", default: "Subscribe" },
              { name: "ctaType", label: "Button Action", type: "select", options: CTA_OPTIONS },
              { name: "ctaUrl", label: "External Link (only if Button Action = External link)", type: "text" },
              { name: "order", label: "Order", type: "number", default: 0 },
              { name: "image", label: "Plan Image", type: "file", previewKey: "image" },
            ]}
          />
        );

      case "blog":
        return (
          <CrudPanel
            title="Blog Posts"
            apiPath="/admin/blog"
            columns={[{ key: "title", label: "Title" }, { key: "published", label: "Published", render: (i) => (i.published ? "Yes" : "Draft") }]}
            fields={[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "excerpt", label: "Excerpt", type: "textarea" },
              { name: "content", label: "Content", type: "textarea", required: true },
              { name: "tags", label: "Tags", type: "tags" },
              { name: "published", label: "Published", type: "checkbox" },
              { name: "coverImage", label: "Cover Image", type: "file", previewKey: "coverImage" },
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface/50 p-4 md:block">
        <p className="mb-6 px-2 font-heading text-lg font-bold gradient-text">J27 Admin</p>
        <nav className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active === tab.key ? "bg-primary/15 text-primary-light" : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="mt-6 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-red-400">
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8">{renderPanel()}</main>
    </div>
  );
};

export default AdminDashboardPage;
