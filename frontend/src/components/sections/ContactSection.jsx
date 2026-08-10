import { useState } from "react";

import AnimatedSection from "../AnimatedSection";
import SectionHeading from "../SectionHeading";
import { Button, Card, Input, Label, Textarea } from "../ui";
import api from "../../lib/axios";

const ContactSection = ({ profile }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/messages", form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatedSection id="contact" className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading
        eyebrow="Contact"
        title="DM to Get Started"
        subtitle={profile?.availability || "Open for custom AI, website, and automation projects."}
      />

      <Card>
        {status === "success" ? (
          <p className="py-8 text-center text-text-secondary">
            Message received — I'll get back to you soon. You can also DM on Instagram for a faster reply.
          </p>
        ) : (
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Subject</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Message</Label>
              <Textarea required minLength={10} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <Button type="submit" className="sm:col-span-2" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send Message"}
            </Button>
            {status === "error" && <p className="text-sm text-red-400 sm:col-span-2">Something went wrong — try again.</p>}
          </form>
        )}
      </Card>
    </AnimatedSection>
  );
};

export default ContactSection;
