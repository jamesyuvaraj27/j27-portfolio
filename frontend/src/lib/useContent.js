import { useEffect, useState } from "react";

import api from "./axios";

// Single shared fetch of the public /api/content payload — HomePage calls this
// once and passes the result down, so every section (and the section
// enable/disable toggles from the CMS) work off one network request.
export function useContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/content")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

export const isSectionEnabled = (sections, key) => {
  if (!Array.isArray(sections)) return true;
  const section = sections.find((s) => s.key === key);
  return section ? section.enabled : true;
};
