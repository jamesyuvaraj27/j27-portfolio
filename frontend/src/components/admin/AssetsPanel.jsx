import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

import api from "../../lib/axios";
import { Button, Card, Label } from "../ui";

const AssetRow = ({ label, assetKey, fieldName, accept }) => {
  const [asset, setAsset] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => api.get("/admin/dashboard").then((res) => setAsset(res.data[assetKey]));

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append(fieldName, file);
    await api.post(`/admin/${assetKey}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    setFile(null);
    await load();
    setBusy(false);
  };

  const remove = async () => {
    setBusy(true);
    await api.delete(`/admin/${assetKey}`);
    await load();
    setBusy(false);
  };

  return (
    <Card>
      <Label>{label}</Label>
      {asset ? (
        <div className="mt-2 flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <a href={asset.url} target="_blank" rel="noreferrer" className="truncate text-sm text-primary-light hover:underline">
            {asset.originalName || asset.url}
          </a>
          <button onClick={remove} disabled={busy} className="text-text-secondary hover:text-red-400">
            <Trash2 size={15} />
          </button>
        </div>
      ) : (
        <p className="mt-2 text-sm text-text-secondary">Not uploaded yet.</p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <input type="file" accept={accept} onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm text-text-secondary" />
        <Button size="sm" onClick={upload} disabled={!file || busy}>
          <Upload size={14} /> Upload
        </Button>
      </div>
    </Card>
  );
};

const AssetsPanel = () => (
  <div className="space-y-6">
    <AssetRow label="Resume (PDF)" assetKey="resume" fieldName="resume" accept="application/pdf" />
    <AssetRow label="Logo" assetKey="logo" fieldName="logo" accept="image/*" />
  </div>
);

export default AssetsPanel;
