import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import api from "../../lib/axios";
import { formatDate } from "../../lib/utils";
import { Card } from "../ui";

const MessagesPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/messages").then((res) => setMessages(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    await api.delete(`/admin/messages/${id}`);
    load();
  };

  if (loading) return <p className="text-sm text-text-secondary">Loading...</p>;

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Contact Messages & Pricing Leads</h2>
      {messages.length === 0 ? (
        <p className="text-sm text-text-secondary">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id} className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2 text-sm">
                  <span className="font-semibold">{msg.name}</span>
                  <span className="text-text-secondary">{msg.email}</span>
                  {msg.source !== "contact" && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary-light">
                      {msg.source.replace("pricing:", "Pricing lead: ")}
                    </span>
                  )}
                </div>
                {msg.subject && <p className="text-sm font-medium">{msg.subject}</p>}
                <p className="mt-1 text-sm text-text-secondary">{msg.message}</p>
                <p className="mt-2 text-xs text-text-secondary/60">{formatDate(msg.createdAt)}</p>
              </div>
              <button onClick={() => remove(msg.id)} className="shrink-0 text-text-secondary hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPanel;
