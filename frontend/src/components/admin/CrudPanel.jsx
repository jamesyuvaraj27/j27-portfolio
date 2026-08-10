import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import api from "../../lib/axios";
import { mediaUrl } from "../../lib/utils";
import { Button, Input, Label, Modal, Textarea } from "../ui";

// Generic list + create + edit + delete panel for any CMS resource.
// `fields` drives both the form and how values get packed into the request
// (FormData when a file field is present, plain JSON otherwise) — add a new
// content type by describing its fields, not by writing a new page.
//
// field.type: "text" | "textarea" | "number" | "checkbox" | "file" | "tags" | "date" | "select"

const emptyValueFor = (field) => {
  if (field.type === "checkbox") return false;
  if (field.type === "number") return field.default ?? 0;
  return field.default ?? "";
};

const buildInitialForm = (fields, item) => {
  const form = {};
  for (const field of fields) {
    if (field.type === "file") continue;
    const raw = item?.[field.name];
    if (field.type === "tags") {
      form[field.name] = Array.isArray(raw) ? raw.join(", ") : raw || "";
    } else if (field.type === "date" && raw) {
      form[field.name] = new Date(raw).toISOString().slice(0, 10);
    } else {
      form[field.name] = raw ?? emptyValueFor(field);
    }
  }
  return form;
};

const CrudPanel = ({ title, description, apiPath, fields, columns, orderable = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get(apiPath)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [apiPath]);

  const openCreate = () => {
    setEditing(null);
    setForm(buildInitialForm(fields, null));
    setFile(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm(buildInitialForm(fields, item));
    setFile(null);
    setError("");
    setModalOpen(true);
  };

  const hasFileField = fields.some((f) => f.type === "file");

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let payload;
      let headers;

      if (hasFileField) {
        const fd = new FormData();
        for (const [key, value] of Object.entries(form)) fd.append(key, value);
        if (file) fd.append(fields.find((f) => f.type === "file").name, file);
        payload = fd;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        payload = form;
      }

      if (editing) {
        await api.put(`${apiPath}/${editing.id}`, payload, { headers });
      } else {
        await api.post(apiPath, payload, { headers });
      }

      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${item[columns[0].key]}"? This can't be undone.`)) return;
    await api.delete(`${apiPath}/${item.id}`);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} /> New
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-text-secondary">Nothing here yet — click "New" to add one.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-hover text-left text-xs uppercase text-text-secondary">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3">{col.label}</th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  {columns.map((col) => (
                    <td key={col.key} className="max-w-xs truncate px-4 py-3">
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="text-text-secondary hover:text-primary-light">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => remove(item)} className="text-text-secondary hover:text-red-400">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${title}` : `New ${title}`}>
        <form onSubmit={submit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label>{field.label}</Label>

              {field.type === "textarea" && (
                <Textarea
                  value={form[field.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  required={field.required}
                />
              )}

              {field.type === "checkbox" && (
                <input
                  type="checkbox"
                  checked={Boolean(form[field.name])}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
              )}

              {field.type === "select" && (
                <select
                  value={form[field.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}

              {field.type === "file" && (
                <>
                  {editing?.[field.previewKey || field.name] && (
                    <img
                      src={mediaUrl(editing[field.previewKey || field.name])}
                      alt=""
                      className="mb-2 h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept={field.accept || "image/*"}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-text-secondary file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
                  />
                </>
              )}

              {["text", "number", "date", "tags"].includes(field.type) && (
                <Input
                  type={field.type === "tags" ? "text" : field.type}
                  value={form[field.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  placeholder={field.type === "tags" ? "comma, separated, values" : undefined}
                  required={field.required}
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CrudPanel;
