import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input, Btn } from "../components/ui";
import { SketchScales, SketchFlower, SketchPen, SketchNotepad, Tri } from "../illustrations/Sketches";

export default function LoginPage({ onRegister }) {
  const { login } = useAuth();
  const [form, setForm]       = useState({ username: "", password: "" });
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setErr("Please enter your username and password.");
      return;
    }
    setErr("");
    setLoading(true);
    const res = await login(form.username, form.password);
    if (!res.ok) setErr(res.msg);
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #ede8df; -webkit-font-smoothing: antialiased; }
        input, button { font-family: inherit; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

        {/* LEFT — illustration panel */}
        <div style={{
          background: "#1a2744", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 56px", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 30% 60%, rgba(74,124,111,0.18) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "absolute", top: "12%", left: "10%" }}><Tri size={20} color="#6aad9c" opacity={0.3} rotation={15} /></div>
          <div style={{ position: "absolute", top: "25%", right: "14%" }}><Tri size={13} color="#b8922a" opacity={0.28} rotation={-12} filled /></div>
          <div style={{ position: "absolute", bottom: "18%", left: "8%" }}><Tri size={16} color="#6aad9c" opacity={0.22} rotation={30} /></div>

          <div style={{ position: "absolute", top: "16%", right: "10%", opacity: 0.65 }}>
            <SketchFlower size={56} />
          </div>
          <div style={{ position: "absolute", bottom: "24%", left: "8%", opacity: 0.55 }}>
            <SketchPen size={48} />
          </div>
          <div style={{ position: "absolute", bottom: "32%", right: "7%", opacity: 0.5 }}>
            <SketchNotepad size={48} />
          </div>

          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <SketchScales size={90} />
          </div>

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginTop: 32 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.4rem", fontWeight: 300, color: "#f8f4ed", lineHeight: 1.2, marginBottom: 14,
            }}>
              Your case,<br /><em style={{ color: "#6aad9c" }}>clearly</em> managed.
            </div>
            <p style={{ fontSize: "0.88rem", color: "rgba(248,244,237,0.45)", lineHeight: 1.8, maxWidth: 320, fontWeight: 300 }}>
              Secure access for advocates, clients, and judges.
              Every hearing, every document — in one place.
            </p>
          </div>

          <div style={{ position: "absolute", bottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 1, background: "rgba(106,173,156,0.4)" }} />
            <span style={{ fontSize: "0.68rem", color: "rgba(248,244,237,0.2)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Trusted · Secure · Transparent
            </span>
            <div style={{ width: 24, height: 1, background: "rgba(106,173,156,0.4)" }} />
          </div>
        </div>

        {/* RIGHT — login form */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 64px", background: "#f8f4ed",
        }}>
          <div style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 600, color: "#1a2744", marginBottom: 6 }}>
              Case<span style={{ color: "#4a7c6f", fontStyle: "italic" }}>Box</span>
            </div>
            <div style={{
              fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#7a7a8a", marginBottom: 40,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ width: 20, height: 1, background: "#d6cfc2", display: "inline-block" }} />
              Sign in to continue
            </div>

            <form onSubmit={submit}>
              <Input label="Username" id="username" value={form.username}
                onChange={set("username")} placeholder="Enter your username" required />
              <Input label="Password" id="password" type="password" value={form.password}
                onChange={set("password")} placeholder="Enter your password" required />

              {err && (
                <div style={{
                  padding: "11px 14px", background: "#fdf3f3",
                  border: "1px solid rgba(155,68,68,0.25)", borderRadius: 6,
                  fontSize: "0.84rem", color: "#9b4444", marginBottom: 16, lineHeight: 1.5,
                }}>{err}</div>
              )}

              <Btn type="submit" variant="primary" size="lg" disabled={loading}
                style={{ width: "100%", justifyContent: "center", marginBottom: 16 }}>
                {loading ? "Signing in…" : "Sign In"}
              </Btn>
            </form>

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <span style={{ fontSize: "0.84rem", color: "#7a7a8a" }}>New client?{" "}</span>
              <button onClick={onRegister} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.84rem", color: "#4a7c6f", fontWeight: 500,
                textDecoration: "underline", textUnderlineOffset: 2,
              }}>Request access</button>
            </div>

            <div style={{ marginTop: 48, padding: "16px 0", borderTop: "1px solid #ede8df" }}>
              <p style={{ fontSize: "0.78rem", color: "#b0a898", lineHeight: 1.7, textAlign: "center" }}>
                Access is granted by your advocate or system administrator.
                If you're a new client, use the link above to register.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
