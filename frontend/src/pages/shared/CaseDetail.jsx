import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { casesAPI, docsAPI, getErrorMessage } from "../../api";
import {
  Card, CardHeader, CardBody, Badge, Btn, Modal, Input, Textarea,
  ProgressBar, SectionLabel, Timeline, EmptyState, Select, toast,
} from "../../components/ui";
import { SketchGavel, SketchFolder, SketchPen, SketchNotepad } from "../../illustrations/Sketches";

export default function CaseDetail({ caseId, onBack }) {
  const { user } = useAuth();
  const [c, setC]             = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");

  const [noteModal, setNoteModal]   = useState(false);
  const [progModal, setProgModal]   = useState(false);
  const [comModal,  setComModal]    = useState(false);
  const [uploadModal, setUpModal]   = useState(false);

  const [noteForm, setNoteForm] = useState({ hearing_date:"", next_date:"", note:"" });
  const [newProg, setNewProg]   = useState(0);
  const [comText, setComText]   = useState("");
  const [saving, setSaving]     = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({ title:"", side:"client", description:"", file:null });
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    casesAPI.get(caseId)
      .then(r => { setC(r.data); setNewProg(r.data.progress); })
      .catch(() => setErr("Could not load case. You may not have access."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [caseId]);

  const isAdmin    = user?.role === "admin";
  const isAdvocate = user?.role === "advocate";
  const canNote    = isAdmin || isAdvocate;

  // Helpers
  const name = (nameField) => nameField || "—";

  const saveNote = async () => {
    if (!noteForm.hearing_date || !noteForm.note) { toast("Date and note are required.","error"); return; }
    setSaving(true);
    try {
      await casesAPI.addHearingNote(caseId, noteForm);
      toast("Hearing note added.","success");
      setNoteModal(false);
      setNoteForm({ hearing_date:"", next_date:"", note:"" });
      load();
    } catch(err) { toast(getErrorMessage(err),"error"); }
    finally { setSaving(false); }
  };

  const saveProgress = async () => {
    const val = Math.min(100, Math.max(0, Number(newProg)));
    setSaving(true);
    try {
      await casesAPI.updateProgress(caseId, val);
      toast("Progress updated.","success");
      setProgModal(false);
      load();
    } catch(err) { toast(getErrorMessage(err),"error"); }
    finally { setSaving(false); }
  };

  const saveComment = async () => {
    if (!comText.trim()) return;
    setSaving(true);
    try {
      await casesAPI.addComment(caseId, comText.trim());
      toast("Comment added.","success");
      setComModal(false);
      setComText("");
      load();
    } catch(err) { toast(getErrorMessage(err),"error"); }
    finally { setSaving(false); }
  };

  const uploadDoc = async () => {
    if (!uploadForm.file || !uploadForm.title) { toast("Title and file are required.","error"); return; }
    const fd = new FormData();
    fd.append("case", caseId);
    fd.append("title", uploadForm.title);
    fd.append("side", uploadForm.side);
    fd.append("description", uploadForm.description);
    fd.append("file", uploadForm.file);
    setSaving(true);
    try {
      await docsAPI.upload(fd);
      toast("Document uploaded.","success");
      setUpModal(false);
      setUploadForm({ title:"", side:"client", description:"", file:null });
      load();
    } catch(err) { toast(getErrorMessage(err),"error"); }
    finally { setSaving(false); }
  };

  const toggleVisibility = async () => {
    try {
      await casesAPI.toggleVisibility(caseId);
      toast("Visibility updated.","success");
      load();
    } catch(err) { toast(getErrorMessage(err),"error"); }
  };

  const deleteDoc = async (docId) => {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    try {
      await docsAPI.delete(docId);
      toast("Document deleted.","success");
      load();
    } catch(err) { toast(getErrorMessage(err),"error"); }
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh" }}>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"#7a7a8a", fontStyle:"italic" }}>Loading case…</span>
    </div>
  );

  if (err || !c) return (
    <div>
      <Btn variant="ghost" onClick={onBack} style={{ marginBottom:16 }}>← Back</Btn>
      <div style={{ padding:"20px", background:"#fdf3f3", border:"1px solid rgba(155,68,68,0.25)", borderRadius:8, color:"#9b4444" }}>
        {err || "Case not found."}
      </div>
    </div>
  );

  const timelineItems = (c.hearing_notes || []).map(n => ({
    date: n.hearing_date, text: n.note, next: n.next_date, who: n.added_by_name,
  }));

  const docs = c.documents || [];

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:20 }}>
        <button onClick={onBack} style={{
          background:"none", border:"1px solid #d6cfc2", borderRadius:6,
          padding:"7px 14px", cursor:"pointer", color:"#7a7a8a", fontSize:"0.82rem",
          marginTop:4,
        }}>← Back</button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.76rem", color:"#7a7a8a" }}>{c.case_no}</span>
            <Badge label={c.status}    variant={c.status} />
            <Badge label={c.priority}  variant={c.priority} />
            <Badge label={c.case_type} variant={c.case_type} />
            {!c.is_visible_to_client && <Badge label="Hidden from client" variant="pending" />}
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", fontWeight:300, color:"#1a2744", lineHeight:1.2 }}>
            {c.case_title}
          </h1>
          <div style={{ fontSize:"0.82rem", color:"#7a7a8a", marginTop:4 }}>{c.court_name}{c.court_city ? ` · ${c.court_city}` : ""}</div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {canNote    && <Btn variant="sage"  size="sm" onClick={() => setNoteModal(true)}>+ Hearing Note</Btn>}
          {isAdmin    && <Btn variant="ghost" size="sm" onClick={() => setProgModal(true)}>Set Progress</Btn>}
          {canNote    && <Btn variant="ghost" size="sm" onClick={() => setComModal(true)}>+ Comment</Btn>}
          {canNote    && <Btn variant="ghost" size="sm" onClick={() => setUpModal(true)}>↑ Upload Doc</Btn>}
          {isAdmin    && <Btn variant={c.is_visible_to_client?"danger":"outline"} size="sm" onClick={toggleVisibility}>
            {c.is_visible_to_client ? "Hide from client" : "Show to client"}
          </Btn>}
        </div>
      </div>

      {/* Progress */}
      <Card style={{ marginBottom:16, padding:"16px 22px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:"0.78rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.06em" }}>Case Progress</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:600, color:"#1a2744" }}>{c.progress}%</span>
        </div>
        <ProgressBar value={c.progress} showLabel={false} />
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Parties */}
        <Card noPad>
          <CardHeader title="Case Parties" />
          <CardBody>
            {[
              { label:"Client",              val:c.client_name },
              { label:"Client Advocate",     val:c.advocate_name },
              { label:"Opposition Advocate", val:c.opposition_advocate_name },
              { label:"Presiding Judge",     val:c.judge_name },
            ].filter(r => r.val).map((r, i) => (
              <div key={i} style={{ padding:"9px 0", borderBottom:"1px solid #ede8df" }}>
                <div style={{ fontSize:"0.7rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:2 }}>{r.label}</div>
                <div style={{ fontSize:"0.88rem", fontWeight:500, color:"#1a1a2e" }}>{r.val}</div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Details */}
        <Card noPad>
          <CardHeader title="Case Details" />
          <CardBody>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              {[
                { label:"Filing Date",    val:c.filing_date || "—" },
                { label:"Last Hearing",   val:c.last_hearing_date || "—" },
                { label:"Next Hearing",   val:c.next_hearing_date || "—" },
                { label:"Tags",           val:c.tags || "—" },
              ].map((d,i) => (
                <div key={i} style={{ padding:"10px 12px", background:"#f8f4ed", borderRadius:7 }}>
                  <div style={{ fontSize:"0.68rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>{d.label}</div>
                  <div style={{ fontSize:"0.86rem", color:"#1a1a2e" }}>{d.val}</div>
                </div>
              ))}
            </div>
            {c.case_summary && (
              <>
                <div style={{ fontSize:"0.68rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Summary</div>
                <p style={{ fontSize:"0.85rem", color:"#1a1a2e", lineHeight:1.7, fontWeight:300 }}>{c.case_summary}</p>
              </>
            )}
            {c.last_verdict && (
              <>
                <div style={{ fontSize:"0.68rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.07em", marginTop:12, marginBottom:6 }}>Last Verdict</div>
                <p style={{ fontSize:"0.85rem", color:"#243460", lineHeight:1.7, fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>{c.last_verdict}</p>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Hearing timeline */}
        <Card noPad>
          <CardHeader title="Hearing History" action={<span style={{ fontSize:"0.74rem", color:"#7a7a8a" }}>{timelineItems.length} entries</span>} />
          <CardBody>
            {timelineItems.length > 0
              ? <Timeline items={timelineItems} />
              : <EmptyState icon={<SketchGavel size={44} />} title="No hearings yet" desc="Hearing notes will appear here." />
            }
          </CardBody>
        </Card>

        {/* Documents */}
        <Card noPad>
          <CardHeader title="Documents" action={<span style={{ fontSize:"0.74rem", color:"#7a7a8a" }}>{docs.length} files</span>} />
          <CardBody>
            {docs.length > 0 ? docs.map(d => (
              <div key={d.id} style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 0",
                borderBottom:"1px solid #ede8df",
              }}>
                <div style={{
                  width:34, height:34, borderRadius:6, background:"#1a2744",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.8rem", flexShrink:0,
                }}>📄</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.86rem", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.title}</div>
                  <div style={{ fontSize:"0.73rem", color:"#7a7a8a" }}>{d.file_type || d.side} · {d.upload_date?.split("T")[0]}</div>
                </div>
                <Badge label={d.side} variant={d.side} />
                {d.file_url && (
                  <a href={d.file_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                    <Btn variant="ghost" size="sm">↓</Btn>
                  </a>
                )}
                {isAdmin && <Btn variant="danger" size="sm" onClick={() => deleteDoc(d.id)}>✕</Btn>}
              </div>
            )) : <EmptyState icon={<SketchFolder size={44} />} title="No documents" desc="Documents appear here." />}
          </CardBody>
        </Card>
      </div>

      {/* Internal comments (admin + advocate only) */}
      {canNote && (
        <Card noPad>
          <CardHeader title="Internal Comments" action={<span style={{ fontSize:"0.74rem", color:"#7a7a8a" }}>Visible to advocates & admin only</span>} />
          <CardBody>
            {(c.comments || []).length > 0 ? (c.comments || []).map(cm => (
              <div key={cm.id} style={{ padding:"12px 14px", background:"#f8f4ed", borderRadius:8, marginBottom:8, border:"1px solid #d6cfc2" }}>
                <div style={{ fontSize:"0.74rem", color:"#7a7a8a", marginBottom:5 }}>
                  {cm.author_name} · {new Date(cm.created_at).toLocaleDateString("en-IN")}
                </div>
                <p style={{ fontSize:"0.86rem", color:"#1a1a2e", lineHeight:1.6 }}>{cm.text}</p>
              </div>
            )) : <EmptyState icon={<SketchPen size={44} />} title="No comments yet" desc="Internal notes for your team." />}
          </CardBody>
        </Card>
      )}

      {/* MODALS */}
      <Modal open={noteModal} onClose={() => setNoteModal(false)} title="Add Hearing Note"
        footer={<><Btn variant="ghost" onClick={() => setNoteModal(false)}>Cancel</Btn>
          <Btn variant="sage" onClick={saveNote} disabled={saving}>{saving?"Saving…":"Save Note"}</Btn></>}>
        <Input label="Hearing Date *" id="hd" type="date" value={noteForm.hearing_date}
          onChange={e => setNoteForm(f=>({...f,hearing_date:e.target.value}))} required />
        <Input label="Next Date" id="nd" type="date" value={noteForm.next_date}
          onChange={e => setNoteForm(f=>({...f,next_date:e.target.value}))} />
        <Textarea label="Note *" id="nt" value={noteForm.note}
          onChange={e => setNoteForm(f=>({...f,note:e.target.value}))} rows={4} />
      </Modal>

      <Modal open={progModal} onClose={() => setProgModal(false)} title="Update Progress"
        footer={<><Btn variant="ghost" onClick={() => setProgModal(false)}>Cancel</Btn>
          <Btn variant="sage" onClick={saveProgress} disabled={saving}>{saving?"Saving…":"Update"}</Btn></>}>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:"0.8rem", color:"#7a7a8a", marginBottom:10 }}>Current: {c.progress}%</div>
          <ProgressBar value={Number(newProg)||0} />
        </div>
        <Input label="New Progress %" id="np" type="number" value={newProg}
          onChange={e => setNewProg(e.target.value)} />
      </Modal>

      <Modal open={comModal} onClose={() => setComModal(false)} title="Add Internal Comment"
        footer={<><Btn variant="ghost" onClick={() => setComModal(false)}>Cancel</Btn>
          <Btn variant="sage" onClick={saveComment} disabled={saving}>{saving?"Saving…":"Add Comment"}</Btn></>}>
        <Textarea label="Comment" id="cm" value={comText} onChange={e=>setComText(e.target.value)} rows={4}
          placeholder="Internal note — visible only to advocates and admin." />
      </Modal>

      <Modal open={uploadModal} onClose={() => setUpModal(false)} title="Upload Document"
        footer={<><Btn variant="ghost" onClick={() => setUpModal(false)}>Cancel</Btn>
          <Btn variant="sage" onClick={uploadDoc} disabled={saving}>{saving?"Uploading…":"Upload"}</Btn></>}>
        <Input label="Document Title *" id="dt" value={uploadForm.title}
          onChange={e=>setUploadForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Property Deed 2024.pdf" />
        <Select label="Side" id="ds" value={uploadForm.side} onChange={e=>setUploadForm(f=>({...f,side:e.target.value}))}>
          {["client","opposition","court","other"].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </Select>
        <Textarea label="Description" id="dd" value={uploadForm.description}
          onChange={e=>setUploadForm(f=>({...f,description:e.target.value}))} rows={2} />
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:"0.75rem", fontWeight:500, color:"#243460", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>File *</div>
          <input type="file" ref={fileRef}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            onChange={e => setUploadForm(f=>({...f, file: e.target.files[0]}))}
            style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.86rem" }} />
          {uploadForm.file && (
            <div style={{ marginTop:6, fontSize:"0.78rem", color:"#4a7c6f" }}>
              Selected: {uploadForm.file.name} ({(uploadForm.file.size/1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
