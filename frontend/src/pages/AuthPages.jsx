import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input, Btn, FormRow } from "../components/ui";
import { SketchNotepad, SketchFlower, Tri } from "../illustrations/Sketches";

/* ════════════════════════════════════════
   REGISTER PAGE — hits real /api/accounts/register/
════════════════════════════════════════ */
export function RegisterPage({ onLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: "", last_name: "", username: "", email: "",
    phone: "", address: "", password: "", confirm: "",
  });
  const [err, setErr]         = useState("");
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (form.password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    setLoading(true);
    const res = await register({
      first_name: form.first_name,
      last_name:  form.last_name,
      username:   form.username,
      email:      form.email,
      phone:      form.phone,
      address:    form.address,
      password:   form.password,
    });
    if (!res.ok) setErr(res.msg);
    else setDone(true);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8f4ed",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 540 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, opacity: 0.6 }}>
            <SketchNotepad size={52} />
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 300, color: "#1a2744", marginBottom: 6 }}>
            Request <em style={{ fontStyle: "italic", color: "#4a7c6f" }}>Access</em>
          </div>
          <p style={{ fontSize: "0.84rem", color: "#7a7a8a", fontWeight: 300 }}>
            Create a client account. Your advocate will link you to your case once approved.
          </p>
        </div>

        {done ? (
          <div style={{
            background: "#f0f7f5", border: "1px solid rgba(74,124,111,0.3)",
            borderRadius: 12, padding: "44px 36px", textAlign: "center",
          }}>
            <div style={{ fontSize: "2.2rem", marginBottom: 14, color: "#4a7c6f" }}>✓</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 600, color: "#1a2744", marginBottom: 12 }}>
              Registration submitted
            </div>
            <p style={{ fontSize: "0.86rem", color: "#7a7a8a", lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>
              Your account is pending administrator approval.
              You'll be able to sign in once an admin verifies and approves your account.
            </p>
            <Btn variant="sage" onClick={onLogin}>Back to Sign In</Btn>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #d6cfc2", borderRadius: 12, padding: "32px 36px" }}>
            <form onSubmit={submit}>
              <FormRow>
                <Input label="First Name *" id="fname" value={form.first_name} onChange={set("first_name")} required />
                <Input label="Last Name *"  id="lname" value={form.last_name}  onChange={set("last_name")}  required />
              </FormRow>
              <Input label="Username *" id="uname" value={form.username} onChange={set("username")} placeholder="Unique username" required />
              <Input label="Email *" id="email" type="email" value={form.email} onChange={set("email")} required />
              <Input label="Phone Number" id="phone" value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" />
              <Input label="Address" id="address" value={form.address} onChange={set("address")} placeholder="City, State" />
              <FormRow>
                <Input label="Password *" id="pwd" type="password" value={form.password} onChange={set("password")} required />
                <Input label="Confirm Password *" id="cpwd" type="password" value={form.confirm} onChange={set("confirm")} required />
              </FormRow>

              {err && (
                <div style={{
                  padding: "11px 14px", background: "#fdf3f3",
                  border: "1px solid rgba(155,68,68,0.25)", borderRadius: 6,
                  fontSize: "0.84rem", color: "#9b4444", marginBottom: 16,
                }}>{err}</div>
              )}

              <Btn type="submit" variant="sage" size="lg" disabled={loading}
                style={{ width: "100%", justifyContent: "center" }}>
                {loading ? "Submitting…" : "Submit Registration"}
              </Btn>
            </form>

            <div style={{ marginTop: 18, textAlign: "center" }}>
              <button onClick={onLogin} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.84rem", color: "#4a7c6f", fontWeight: 500,
              }}>← Back to Sign In</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PENDING APPROVAL PAGE
════════════════════════════════════════ */
export function PendingPage() {
  const { user, logout } = useAuth();
  return (
    <div style={{
      minHeight: "100vh", background: "#f8f4ed",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 40, textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "12%", left: "8%", opacity: 0.12 }}><Tri size={28} color="#4a7c6f" opacity={1} rotation={15} /></div>
      <div style={{ position: "absolute", bottom: "15%", right: "9%", opacity: 0.1 }}><Tri size={20} color="#b8922a" opacity={1} rotation={-18} filled /></div>
      <div style={{ position: "absolute", top: "22%", right: "10%", opacity: 0.15 }}><SketchFlower size={70} /></div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, opacity: 0.45 }}>
          <SketchNotepad size={72} />
        </div>

        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 300, color: "#1a2744", marginBottom: 14 }}>
          Your account is<br /><em style={{ color: "#b8922a" }}>awaiting approval</em>
        </div>

        <p style={{ fontSize: "0.88rem", color: "#7a7a8a", lineHeight: 1.9, fontWeight: 300, marginBottom: 28 }}>
          Hello <strong style={{ color: "#1a2744" }}>{user?.first_name}</strong>, your registration has been received.
          An administrator will review and approve your account shortly.
          This typically takes one business day.
        </p>

        <div style={{
          background: "#d9ede8", border: "1px solid rgba(74,124,111,0.25)",
          borderRadius: 10, padding: "16px 22px", marginBottom: 32,
          fontSize: "0.84rem", color: "#2d6a4f", lineHeight: 1.7,
        }}>
          In the meantime, let your advocate know you've registered so they can link you to your case.
        </div>

        <Btn variant="ghost" onClick={logout}>Sign Out</Btn>
      </div>
    </div>
  );
}
