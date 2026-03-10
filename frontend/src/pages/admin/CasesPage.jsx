import { useState, useEffect, useCallback } from "react";
import { casesAPI, usersAPI, getErrorMessage } from "../../api";
import {
  Card, CardBody, CardHeader, DataTable, Badge, Btn,
  Modal, Input, Select, Textarea, FormRow, SearchBar,
  ProgressBar, SectionLabel, EmptyState, toast,
} from "../../components/ui";
import { SketchNotepad } from "../../illustrations/Sketches";

const TYPES    = ["civil","criminal","family","property","labour","commercial","constitutional","other"];
const STATUSES = ["ongoing","adjourned","judgement_reserved","closed","disposed"];
const PRIOS    = ["low","medium","high","urgent"];

const emptyForm = {
  case_no:"", case_title:"", case_type:"civil", priority:"medium",
  court_name:"", court_city:"", status:"ongoing", progress:0,
  client:"", client_advocate:"", opposition_advocate:"", judge:"",
  filing_date:"", next_hearing_date:"", last_hearing_date:"",
  case_summary:"", last_verdict:"", tags:"", is_visible_to_client:true,
};

export default function AdminCasesPage({ setPage, setDetailCase }) {
  const [cases, setCases]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [q, setQ]               = useState("");
  const [filterStatus, setFS]   = useState("");
  const [filterType, setFT]     = useState("");
  const [filterPrio, setFP]     = useState("");
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  const [advocates, setAdvocates] = useState([]);
  const [clients, setClients]     = useState([]);
  const [judges, setJudges]       = useState([]);

  const load = useCallback(() => {
    setLoading(true);
    casesAPI.list({ search: q, status: filterStatus, case_type: filterType, priority: filterPrio })
      .then(r => setCases(r.data))
      .catch(() => toast("Failed to load cases.", "error"))
      .finally(() => setLoading(false));
  }, [q, filterStatus, filterType, filterPrio]);

  useEffect(() => { load(); }, [load]);

  // Load role lists for dropdowns (once)
  useEffect(() => {
    usersAPI.byRole("advocate").then(r => setAdvocates(r.data)).catch(() => {});
    usersAPI.byRole("client").then(r => setClients(r.data)).catch(() => {});
    usersAPI.byRole("judge").then(r => setJudges(r.data)).catch(() => {});
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit   = c  => {
    setEditing(c.id);
    setForm({
      ...emptyForm, ...c,
      client:               c.client              || "",
      client_advocate:      c.client_advocate      || "",
      opposition_advocate:  c.opposition_advocate  || "",
      judge:                c.judge                || "",
    });
    setModal(true);
  };

  const save = async () => {
    if (!form.case_no || !form.case_title || !form.court_name || !form.client) {
      toast("Case No, Title, Court, and Client are required.", "error"); return;
    }
    setSaving(true);
    try {
      if (editing) {
        await casesAPI.update(editing, form);
        toast("Case updated.", "success");
      } else {
        await casesAPI.create(form);
        toast("Case created.", "success");
      }
      setModal(false);
      load();
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const cols = [
    { label:"Case No",   render: c => <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.78rem", color:"#243460" }}>{c.case_no}</span> },
    { label:"Title",     render: c => (
      <div>
        <div style={{ fontSize:"0.86rem", fontWeight:500, color:"#1a1a2e" }}>{c.case_title}</div>
        <div style={{ fontSize:"0.73rem", color:"#7a7a8a" }}>{c.court_name}</div>
      </div>
    )},
    { label:"Type",      render: c => <Badge label={c.case_type} variant={c.case_type} /> },
    { label:"Priority",  render: c => <Badge label={c.priority}  variant={c.priority}  /> },
    { label:"Client",    render: c => <span style={{ fontSize:"0.84rem" }}>{c.client_name || "—"}</span> },
    { label:"Hearing",   render: c => <span style={{ fontSize:"0.8rem", color:c.next_hearing_date?"#243460":"#7a7a8a" }}>{c.next_hearing_date || "—"}</span> },
    { label:"Progress",  render: c => <div style={{ width:100 }}><ProgressBar value={c.progress} /></div> },
    { label:"Status",    render: c => <Badge label={c.status} variant={c.status} /> },
    { label:"",          render: c => (
      <Btn variant="ghost" size="sm" onClick={e => { e.stopPropagation(); openEdit(c); }}>Edit</Btn>
    )},
  ];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <SectionLabel>Case Management</SectionLabel>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744" }}>
            All <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Cases</em>
          </h1>
        </div>
        <Btn variant="sage" onClick={openCreate}>+ New Case</Btn>
      </div>

      <Card noPad style={{ marginBottom:14 }}>
        <CardBody style={{ padding:"12px 18px" }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <SearchBar value={q} onChange={v => setQ(v)} placeholder="Search case no, title, court…" style={{ flex:"1 1 220px" }} />
            {[
              { val:filterStatus, set:setFS, opts:STATUSES, label:"All Statuses" },
              { val:filterType,   set:setFT, opts:TYPES,    label:"All Types" },
              { val:filterPrio,   set:setFP, opts:PRIOS,    label:"All Priorities" },
            ].map((f,i) => (
              <select key={i} value={f.val} onChange={e=>f.set(e.target.value)} style={{
                padding:"8px 12px", border:"1.5px solid #d6cfc2", borderRadius:6,
                fontFamily:"'DM Sans',sans-serif", fontSize:"0.84rem", background:"#fff",
              }}>
                <option value="">{f.label}</option>
                {f.opts.map(o=><option key={o} value={o}>{o.replace(/_/g," ")}</option>)}
              </select>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card noPad>
        {loading
          ? <div style={{ padding:40, textAlign:"center", color:"#7a7a8a" }}>Loading cases…</div>
          : cases.length === 0
            ? <EmptyState icon={<SketchNotepad size={64} />} title="No cases found" desc="Try adjusting your search or create a new case." />
            : <DataTable columns={cols} rows={cases} onRowClick={c => { setDetailCase(c.id); setPage("case-detail"); }} />
        }
        <div style={{ padding:"10px 16px", borderTop:"1px solid #ede8df", fontSize:"0.74rem", color:"#7a7a8a" }}>
          {cases.length} cases
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)}
        title={editing ? "Edit Case" : "Create New Case"} size="lg"
        footer={<>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn variant="sage"  onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Create Case"}</Btn>
        </>}>
        <FormRow>
          <Input label="Case Number *" id="cno" value={form.case_no}    onChange={set("case_no")}    placeholder="DEL/CIV/2026/001" />
          <Input label="Case Title *"  id="ct"  value={form.case_title} onChange={set("case_title")} placeholder="Plaintiff vs. Defendant" />
        </FormRow>
        <FormRow>
          <Select label="Case Type" id="ctype" value={form.case_type} onChange={set("case_type")}>
            {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </Select>
          <Select label="Priority" id="cprio" value={form.priority} onChange={set("priority")}>
            {PRIOS.map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
          </Select>
        </FormRow>
        <FormRow>
          <Input label="Court Name *" id="crt"  value={form.court_name} onChange={set("court_name")} placeholder="Delhi High Court" />
          <Input label="Court City"   id="city" value={form.court_city} onChange={set("court_city")} placeholder="Delhi" />
        </FormRow>
        <FormRow>
          <Select label="Client *" id="cli" value={form.client} onChange={set("client")}>
            <option value="">Select client…</option>
            {clients.map(u=><option key={u.id} value={u.id}>{u.full_name}</option>)}
          </Select>
          <Select label="Client Advocate" id="cadv" value={form.client_advocate} onChange={set("client_advocate")}>
            <option value="">Select advocate…</option>
            {advocates.map(u=><option key={u.id} value={u.id}>{u.full_name}</option>)}
          </Select>
        </FormRow>
        <FormRow>
          <Select label="Opposition Advocate" id="oadv" value={form.opposition_advocate} onChange={set("opposition_advocate")}>
            <option value="">None</option>
            {advocates.map(u=><option key={u.id} value={u.id}>{u.full_name}</option>)}
          </Select>
          <Select label="Judge" id="jdg" value={form.judge} onChange={set("judge")}>
            <option value="">Select judge…</option>
            {judges.map(u=><option key={u.id} value={u.id}>{u.full_name}</option>)}
          </Select>
        </FormRow>
        <FormRow>
          <Input label="Filing Date"   id="fd"  type="date" value={form.filing_date}       onChange={set("filing_date")} />
          <Input label="Next Hearing"  id="nhd" type="date" value={form.next_hearing_date} onChange={set("next_hearing_date")} />
        </FormRow>
        <FormRow>
          <Select label="Status" id="cst" value={form.status} onChange={set("status")}>
            {STATUSES.map(s=><option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
          </Select>
          <Input label="Progress (0-100)" id="prog" type="number" value={form.progress} onChange={set("progress")} />
        </FormRow>
        <Textarea label="Case Summary" id="cs"   value={form.case_summary} onChange={set("case_summary")} rows={3} />
        <Textarea label="Last Verdict" id="lv"   value={form.last_verdict} onChange={set("last_verdict")}  rows={2} />
        <Input    label="Tags (comma-separated)" id="tags" value={form.tags} onChange={set("tags")} placeholder="property, deed, delhi" />
      </Modal>
    </div>
  );
}
