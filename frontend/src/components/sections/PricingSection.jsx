import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import SectionKicker from "../SectionKicker";
import { Button, Card, Input, Label, Modal } from "../ui";
import { cn, mediaUrl } from "../../lib/utils";
import api from "../../lib/axios";
import { EASE, fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";

// "Subscribe" has no live payment provider wired up yet (per plan: attach one
// later). Until then, ctaType controls what the button does:
//   EXTERNAL_LINK + ctaUrl set -> opens that link directly (drop in a Stripe/
//     Razorpay payment link here later and it just works, no code change)
//   CONTACT                    -> smooth-scrolls to the Contact section
//   SUBSCRIBE (default)        -> opens a small lead-capture modal that POSTs
//     to /api/pricing/:id/interest, so you still capture the interest as a
//     Message instead of losing it.
const InterestModal = ({ plan, open, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post(`/pricing/${plan.id}/interest`, form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Subscribe — ${plan?.name || ""}`}>
      {status === "success" ? (
        <p className="text-text-secondary">Thanks — I'll reach out about the {plan.name} plan shortly.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Message (optional)</Label>
            <Input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Anything specific you need?" />
          </div>
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Notify me / Get started"}
          </Button>
          {status === "error" && <p className="text-sm text-red-400">Something went wrong — try again.</p>}
        </form>
      )}
    </Modal>
  );
};

const PricingSection = ({ pricingPlans = [] }) => {
  const [activePlan, setActivePlan] = useState(null);

  if (pricingPlans.length === 0) return null;

  const handleCta = (plan) => {
    if (plan.ctaType === "EXTERNAL_LINK" && plan.ctaUrl) {
      window.open(plan.ctaUrl, "_blank", "noreferrer");
      return;
    }

    if (plan.ctaType === "CONTACT") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setActivePlan(plan);
  };

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <SectionKicker number="07" label="Pricing" />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-2xl text-3xl font-bold sm:text-4xl"
      >
        Plans built for <span className="gradient-text italic">real budgets.</span>
      </motion.h2>
      <p className="mt-4 max-w-xl text-text-secondary">Pick a starting point — every plan can be customized.</p>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pricingPlans.map((plan) => (
          <motion.div key={plan.id} variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
            <motion.div
              animate={
                plan.highlighted
                  ? { scale: [1, 1.015, 1] }
                  : { scale: 1 }
              }
              transition={
                plan.highlighted
                  ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0 }
              }
            >
            <Card
              className={cn("flex h-full flex-col overflow-hidden p-0", plan.highlighted && "border-primary-light shadow-glow")}
            >
              {plan.image && (
                <img src={mediaUrl(plan.image)} alt={plan.name} className="h-36 w-full object-cover" loading="lazy" />
              )}

              <div className="flex flex-1 flex-col p-6">
                {plan.highlighted && (
                  <span className="mb-3 w-fit rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary-light">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-2 text-3xl font-bold">
                  {plan.price}
                  <span className="text-sm font-normal text-text-secondary"> / {plan.billingPeriod}</span>
                </p>
                {plan.description && <p className="mt-3 text-sm text-text-secondary">{plan.description}</p>}

                {plan.features?.length > 0 && (
                  <ul className="mt-5 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Check size={16} className="mt-0.5 shrink-0 text-primary-light" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  onClick={() => handleCta(plan)}
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="mt-6 w-full"
                >
                  {plan.ctaLabel || "Subscribe"}
                </Button>
              </div>
            </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <InterestModal plan={activePlan} open={Boolean(activePlan)} onClose={() => setActivePlan(null)} />
    </section>
  );
};

export default PricingSection;
