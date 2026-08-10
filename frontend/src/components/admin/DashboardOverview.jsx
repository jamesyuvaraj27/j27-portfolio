import { useEffect, useState } from "react";

import api from "../../lib/axios";
import { Card } from "../ui";

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data.stats));
  }, []);

  if (!stats) return <p className="text-sm text-text-secondary">Loading...</p>;

  const cards = [
    ["Projects", stats.projectCount],
    ["Skills", stats.skillCount],
    ["Certifications", stats.certificationCount],
    ["Testimonials", stats.testimonialCount],
    ["Gallery Photos", stats.photoCount],
    ["Pricing Plans", stats.pricingPlanCount],
    ["Blog Posts", `${stats.publishedPostCount}/${stats.postCount} published`],
    ["Messages", stats.messageCount],
  ];

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <p className="text-xs uppercase tracking-wide text-text-secondary">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
