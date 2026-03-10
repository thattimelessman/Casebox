import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { casesAPI, docsAPI } from "../api";
import {
  Card, CardBody, CardHeader, Badge, Btn, DataTable,
  SearchBar, SectionLabel, ProgressBar, EmptyState, StatCard, toast,
} from "../components/ui";
import { SketchNotepad, SketchScales, SketchFolder, SketchFlower, SketchGavel } from "../illustrations/Sketches";

/* ── Shared hook ─────────────────────────────────────────────── */
function useCases(params = {}) {
  const [cases, setCases]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    casesAPI.list(params)
      .then(r => setCases(r.data))
      .catch(() => toast("Failed to load cases.", "error"))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cases, loading };
}

/* ── Shared table ────────────────────────────────────────────── */
function CasesTable({ cases, loading, onOpen }) {
  const [q, setQ] = useState("");
  const filtered  = cases.filter(c => {
    const qs = q.toLowerCase();
    return !q || c.case_no?.toLowerCase().includes(qs) || c.case_title?.toLowerCase().includes(qs);
  });

  const cols = [
    { label:"Case No",  render: c => <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.78rem", color:"#243460" }}>{c.case_no}</span> },
    { label:"Title",    render: c => (
      <div>
        <div style={{ fontSize:"0.86rem", fontWeight:500, color:"#1a1a2e" }}>{c.case_title}</div>
        <div style={{ fontSize:"0.73rem", color:"#7a7a8a" }}>{c.court_name}</div>
      </div>
    )},
    { label:"Type",     render: c => <Badge label={c.case_type} variant={c.case_type} /> },
    { label:"Priority", render: c => <Badge label={c.priority}  variant={c.priority}  /> },
    { label:"Next Hearing", render: c => (
      <span style={{ fontSize:"0.82rem", color:c.next_hearing_date?"#243460":"#7a7a8a" }}>
        {c.next_hearing_date || "—"}
      </span>
    )},
    { label:"Progress", render: c => <div style={{ width:90 }}><ProgressBar value={c.progress} /></div> },
    { label:"Status",   render: c => <Badge label={c.status} variant={c.status} /> },
  ];

  return (
    <>
      <Card noPad style={{ marginBottom:14 }}>
        <CardBody style={{ padding:"12px 18px" }}>
          <SearchBar value={q} onChange={setQ} placeholder="Search cases…" />
        </CardBody>
      </Card>
      <Card noPad>
        {loading
          ? <div style={{ padding:40, textAlign:"center", color:"#7a7a8a" }}>Loading…</div>
          : filtered.length === 0
            ? <EmptyState icon={<SketchNotepad size={64} />} title="No cases" desc="No cases match your search." />
            : <DataTable columns={cols} rows={filtered} onRowClick={c => onOpen(c.id)} />
        }
      </Card>
    </>
  );
}

/* ════════════════════════════════════════
   ADVOCATE CASES
════════════════════════════════════════ */
export function AdvocateCasesPage({ setPage, setDetailCase }) {
  const { user } = useAuth();
  const { cases, loading } = useCases();

  const myClient = cases.filter(c => c.client_advocate === user.id);
  const myOpp    = cases.filter(c => c.opposition_advocate === user.id);
  const [tab, setTab] = useState("client");

  const shown = tab === "client" ? myClient : myOpp;

  return (
    <div>
      <SectionLabel>My Practice</SectionLabel>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744" }}>
          My <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Cases</em>
        </h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        <StatCard icon={<SketchNotepad size={24} />} label="As Client Advocate" value={myClient.length} />
        <StatCard icon={<SketchScales size={24} />}  label="As Opposition"      value={myOpp.length} accent="#9b4444" />
        <StatCard icon={<SketchFlower size={24} />}  label="Active" value={cases.filter(c=>c.status==="ongoing").length} />
      </div>

      <div style={{ display:"flex", gap:0, marginBottom:16, border:"1px solid #d6cfc2", borderRadius:8, overflow:"hidden", width:"fit-content" }}>
        {[
          { key:"client", label:`Client Advocate (${myClient.length})` },
          { key:"opp",    label:`Opposition (${myOpp.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding:"9px 20px", border:"none", cursor:"pointer",
            background: tab===t.key ? "#1a2744" : "#fff",
            color:      tab===t.key ? "#f8f4ed" : "#7a7a8a",
            fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem",
            fontWeight: tab===t.key ? 500 : 400, transition:"all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      <CasesTable cases={shown} loading={loading}
        onOpen={id => { setDetailCase(id); setPage("case-detail"); }} />
    </div>
  );
}

/* ════════════════════════════════════════
   ADVOCATE DOCUMENTS
════════════════════════════════════════ */
export function AdvocateDocumentsPage({ setPage, setDetailCase }) {
  const { cases, loading } = useCases();
  const myCases = cases.filter(c => c.document_count > 0);

  return (
    <div>
      <SectionLabel>Documents</SectionLabel>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744", marginBottom:24 }}>
        Case <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Documents</em>
      </h1>

      {loading ? (
        <div style={{ padding:40, textAlign:"center", color:"#7a7a8a" }}>Loading…</div>
      ) : myCases.length === 0 ? (
        <Card><EmptyState icon={<SketchFolder size={64} />} title="No documents" desc="Documents from your cases appear here." /></Card>
      ) : myCases.map(c => (
        <Card key={c.id} noPad style={{ marginBottom:14 }}>
          <CardHeader title={c.case_title} action={
            <Btn variant="ghost" size="sm" onClick={() => { setDetailCase(c.id); setPage("case-detail"); }}>
              View Case & Upload →
            </Btn>
          } />
          <CardBody>
            <div style={{ fontSize:"0.82rem", color:"#7a7a8a" }}>
              {c.document_count} document{c.document_count !== 1 ? "s" : ""} · {c.case_no}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   JUDGE CASES
════════════════════════════════════════ */
export function JudgeCasesPage({ setPage, setDetailCase }) {
  const { cases, loading } = useCases();

  return (
    <div>
      <SectionLabel>Assigned Matters</SectionLabel>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744" }}>
          Assigned <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Cases</em>
        </h1>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        <StatCard icon={<SketchScales size={24} />}  label="Total Assigned" value={cases.length} />
        <StatCard icon={<SketchGavel size={24} />}   label="Ongoing"        value={cases.filter(c=>c.status==="ongoing").length} />
        <StatCard icon={<SketchNotepad size={24} />} label="Reserved"       value={cases.filter(c=>c.status==="judgement_reserved").length} accent="#9b4444" />
      </div>
      <CasesTable cases={cases} loading={loading}
        onOpen={id => { setDetailCase(id); setPage("case-detail"); }} />
    </div>
  );
}

/* ════════════════════════════════════════
   CLIENT CASES
════════════════════════════════════════ */
export function ClientCasesPage({ setPage, setDetailCase }) {
  const { cases, loading } = useCases();

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#7a7a8a" }}>Loading your case…</div>;

  return (
    <div>
      <SectionLabel>My Matter</SectionLabel>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744", marginBottom:24 }}>
        My <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Case</em>
      </h1>

      {cases.length === 0 ? (
        <Card>
          <EmptyState icon={<SketchNotepad size={64} />} title="No case linked yet"
            desc="Your advocate will link your case once your account is set up. Check back soon." />
        </Card>
      ) : cases.map(c => (
        <Card key={c.id} noPad style={{ marginBottom:16, cursor:"pointer", transition:"box-shadow 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow="0 6px 24px rgba(26,39,68,0.12)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow="0 1px 4px rgba(26,39,68,0.06)"}
          onClick={() => { setDetailCase(c.id); setPage("case-detail"); }}>

          <div style={{ height:3, background:
            c.priority==="urgent"?"#9b4444":c.priority==="high"?"#b8922a":c.priority==="medium"?"#4a6fa5":"#4a7c6f",
            borderRadius:"12px 12px 0 0" }} />

          <CardBody style={{ padding:"22px 26px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.74rem", color:"#7a7a8a" }}>{c.case_no}</span>
                  <Badge label={c.status}    variant={c.status} />
                  <Badge label={c.case_type} variant={c.case_type} />
                </div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", fontWeight:600, color:"#1a2744", marginBottom:6 }}>
                  {c.case_title}
                </h2>
                <div style={{ fontSize:"0.82rem", color:"#7a7a8a", marginBottom:16 }}>{c.court_name}{c.court_city ? ` · ${c.court_city}` : ""}</div>

                <ProgressBar value={c.progress} />

                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:16 }}>
                  {[
                    { label:"Filed On",     val:c.filing_date       || "—" },
                    { label:"Last Hearing", val:c.last_hearing_date || "—" },
                    { label:"Next Hearing", val:c.next_hearing_date || "—" },
                  ].map((d,i) => (
                    <div key={i} style={{ padding:"10px 14px", background:"#f8f4ed", borderRadius:7 }}>
                      <div style={{ fontSize:"0.66rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{d.label}</div>
                      <div style={{ fontSize:"0.88rem", color:"#1a1a2e", fontWeight:500 }}>{d.val}</div>
                    </div>
                  ))}
                </div>

                {c.last_hearing_date && (
                  <div style={{ marginTop:14, padding:"12px 16px", background:"#f0f7f5", borderRadius:7, border:"1px solid rgba(74,124,111,0.2)" }}>
                    <div style={{ fontSize:"0.66rem", color:"#4a7c6f", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Advocate</div>
                    <p style={{ fontSize:"0.86rem", color:"#1a1a2e", fontWeight:500 }}>{c.advocate_name || "To be assigned"}</p>
                  </div>
                )}
              </div>
              <div style={{ flexShrink:0, opacity:0.2 }}>
                <SketchScales size={52} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   CLIENT DOCUMENTS
════════════════════════════════════════ */
export function ClientDocumentsPage({ setPage, setDetailCase }) {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    docsAPI.list()
      .then(r => setDocs(r.data))
      .catch(() => toast("Failed to load documents.", "error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SectionLabel>My Documents</SectionLabel>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744", marginBottom:24 }}>
        My <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Documents</em>
      </h1>

      {loading ? (
        <div style={{ padding:40, textAlign:"center", color:"#7a7a8a" }}>Loading…</div>
      ) : docs.length === 0 ? (
        <Card><EmptyState icon={<SketchFolder size={64} />} title="No documents yet"
          desc="When your advocate shares documents with you, they'll appear here." /></Card>
      ) : (
        <Card noPad>
          {docs.map((d, i) => (
            <div key={d.id} style={{
              display:"flex", alignItems:"center", gap:12, padding:"14px 18px",
              borderBottom: i < docs.length-1 ? "1px solid #ede8df":"none",
            }}>
              <div style={{
                width:38, height:38, borderRadius:8, background:"#1a2744",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0,
              }}>📄</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.88rem", fontWeight:500, color:"#1a1a2e" }}>{d.title}</div>
                <div style={{ fontSize:"0.74rem", color:"#7a7a8a" }}>
                  {d.side} · {d.upload_date?.split("T")[0] || "—"}
                  {d.description && ` · ${d.description}`}
                </div>
              </div>
              <Badge label={d.side} variant={d.side} />
              {d.file_url && (
                <a href={d.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                  <Btn variant="ghost" size="sm">↓ Download</Btn>
                </a>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
