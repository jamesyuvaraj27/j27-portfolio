import { useState } from "react";
import { useNavigate } from "react-router";

import { Button, Card, Input, Label } from "../components/ui";
import { useAdminAuth } from "../lib/useAdminAuth";

const AdminLoginPage = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold">J27 Admin</h1>
        <p className="mb-6 text-sm text-text-secondary">Sign in to manage your content.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Password</Label>
            <Input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
