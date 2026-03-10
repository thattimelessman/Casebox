import { useState, useEffect } from "react";
import { casesAPI } from "../../api";
import { StatCard, Card, CardHeader, CardBody, Badge, ProgressBar, SectionLabel } from "../../components/ui";
import { SketchScales, SketchNotepad, SketchUser, SketchFlower, SketchBell } from "../../illustrations/Sketches";

export default function AdminDashboard({ setPage }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]       = useState("");

  useEffect(() => {
    casesAPI.dashboard()
      .then(r => setData(r.data))
      .catch(() => setErr("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (err) return <ErrorMsg msg={err} />;

  const { total_cases, by_status, by_type, pending_clients, total_users, upcoming_hearings } = data;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <SectionLabel>Overview</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#1a2744" }}>
          Good morning — here's <em style={{ fontStyle: "italic", color: "#4a7c6f" }}>today's picture.</em>
        </h1>
      </div>

      {pending_clients > 0 && (
        <div onClick={() => setPage("pending")} style={{
          background: "#fdf8ef", border: "1px solid rgba(184,146,42,0.3)",
          borderLeft: "3px solid #b8922a", borderRadius: 8,
          padding: "12px 18px", marginBottom: 22,
          display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
        }}>
          <SketchBell size={22} />
          <span style={{ fontSize: "0.86rem", color: "#7a4800" }}>
            <strong>{pending_clients} client{pending_clients > 1 ? "s" : ""}</strong> awaiting approval — review now →
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        <div style={{ cursor: "pointer" }} onClick={() => setPage("cases")}>
          <StatCard icon={<SketchNotepad size={28} />} label="Total Cases"    value={total_cases} sub={`${by_status?.ongoing || 0} active`} />
        </div>
        <div style={{ cursor: "pointer" }} onClick={() => setPage("users")}>
          <StatCard icon={<SketchUser size={28} />}    label="Users"          value={total_users} />
        </div>
        <div style={{ cursor: "pointer" }} onClick={() => setPage("pending")}>
          <StatCard icon={<SketchBell size={28} />}    label="Pending Approvals" value={pending_clients} accent="#b8922a" />
        </div>
        <StatCard icon={<SketchScales size={28} />}    label="Resolved"       value={(by_status?.closed || 0) + (by_status?.disposed || 0)} accent="#4a7c6f" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Upcoming hearings */}
        <Card noPad>
          <CardHeader title="Upcoming Hearings (30 days)" action={
            <span style={{ fontSize: "0.74rem", color: "#7a7a8a" }}>{upcoming_hearings?.length} scheduled</span>
          } />
          <CardBody>
            {!upcoming_hearings?.length ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#7a7a8a", fontSize: "0.86rem" }}>
                No hearings in the next 30 days
              </div>
            ) : upcoming_hearings.map((c, i) => (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: i < upcoming_hearings.length - 1 ? "1px solid #ede8df" : "none",
              }}>
                <div style={{
                  width: 40, textAlign: "center", background: "#f0f7f5", borderRadius: 7, padding: "5px 0", flexShrink: 0,
                }}>
                  <div style={{ fontSize: "0.65rem", color: "#4a7c6f", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {new Date(c.next_hearing_date).toLocaleString("en", { month: "short" })}
                  </div>
                  <div style={{ fontSize: "1rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "#1a2744" }}>
                    {new Date(c.next_hearing_date).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.84rem", fontWeight: 500, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.case_title}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#7a7a8a" }}>{c.case_no} · {c.court_name}</div>
                </div>
                <Badge label={c.priority} variant={c.priority} />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Status breakdown */}
        <Card noPad>
          <CardHeader title="Case Status" />
          <CardBody>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {Object.entries(by_status || {}).map(([s, n]) => (
                <div key={s} style={{
                  flex: "1 1 130px", padding: "14px 16px",
                  background: "#f8f4ed", borderRadius: 8, border: "1px solid #d6cfc2", textAlign: "center",
                }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 600, color: "#1a2744" }}>{n}</div>
                  <div style={{ marginTop: 4 }}><Badge label={s} variant={s} /></div>
                </div>
              ))}
            </div>
            <CardHeader title="Cases by Type" style={{ padding: "0 0 10px", border: "none" }} />
            {Object.entries(by_type || {}).map(([type, count]) => (
              <div key={type} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.82rem", color: "#1a1a2e", textTransform: "capitalize" }}>{type}</span>
                  <span style={{ fontSize: "0.78rem", color: "#7a7a8a" }}>{count}</span>
                </div>
                <ProgressBar value={Math.round((count / total_cases) * 100)} showLabel={false} />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#7a7a8a", fontStyle: "italic" }}>
        Loading…
      </span>
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div style={{ padding: "20px", background: "#fdf3f3", border: "1px solid rgba(155,68,68,0.25)", borderRadius: 8, color: "#9b4444" }}>
      {msg}
    </div>
  );
}
