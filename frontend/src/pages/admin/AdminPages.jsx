import { useState, useEffect, useCallback } from "react";
import { usersAPI, logsAPI, getErrorMessage } from "../../api";
import {
  Card, CardBody, CardHeader, DataTable, Badge, Btn, Modal,
  Input, Select, FormRow, SearchBar, SectionLabel, EmptyState,
  StatCard, toast,
} from "../../components/ui";
import { SketchUser, SketchBell, SketchDoc } from "../../illustrations/Sketches";

/* ════════════════════════════════════════
   USERS PAGE
════════════════════════════════════════ */
export function UsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ]             = useState("");
  const [roleF, setRoleF]     = useState("");
  const [modal, setModal]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ first_name:"", last_name:"", username:"", email:"", phone:"", password:"", role:"advocate" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const load = useCallback(() => {
    setLoading(true);
    usersAPI.list({ search: q, role: roleF })
      .then(r => setUsers(r.data))
      .catch(() => toast("Failed to load users.", "error"))
      .finally(() => setLoading(false));
  }, [q, roleF]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (user, approve) => {
    try {
      await usersAPI.approve(user.id, { is_approved: approve });
      toast(`${user.first_name} ${approve ? "approved" : "revoked"}.`, "success");
      load();
    } catch (err) {
      toast(getErrorMessage(err), "error");
    }
  };

  const saveUser = async () => {
    if (!form.username || !form.email || !form.password) { toast("Fill required fields.", "error"); return; }
    setSaving(true);
    try {
      await usersAPI.create(form);
      toast("User created.", "success");
      setModal(false);
      setForm({ first_name:"", last_name:"", username:"", email:"", phone:"", password:"", role:"advocate" });
      load();
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const roleCounts = ["admin","advocate","judge","client"].reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length; return acc;
  }, {});

  const cols = [
    { label:"Name",   render: u => (
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:32, height:32, borderRadius:"50%", background:"rgba(74,124,111,0.12)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Cormorant Garamond',serif", fontSize:"0.95rem", color:"#4a7c6f", fontWeight:600,
        }}>{u.first_name?.[0]}</div>
        <div>
          <div style={{ fontSize:"0.86rem", fontWeight:500 }}>{u.first_name} {u.last_name}</div>
          <div style={{ fontSize:"0.74rem", color:"#7a7a8a" }}>@{u.username}</div>
        </div>
      </div>
    )},
    { label:"Email",   render: u => <span style={{ fontSize:"0.84rem" }}>{u.email}</span> },
    { label:"Phone",   render: u => <span style={{ fontSize:"0.84rem", color:"#7a7a8a" }}>{u.phone || "—"}</span> },
    { label:"Role",    render: u => <Badge label={u.role} variant={u.role} /> },
    { label:"Status",  render: u => u.role === "client"
        ? <Badge label={u.is_approved ? "approved" : "pending"} variant={u.is_approved ? "approved" : "pending"} />
        : <span style={{ fontSize:"0.78rem", color:"#7a7a8a" }}>—</span>
    },
    { label:"Joined",  render: u => <span style={{ fontSize:"0.8rem", color:"#7a7a8a" }}>{u.created_at?.split("T")[0]}</span> },
    { label:"",        render: u => u.role === "client" ? (
      <Btn variant={u.is_approved ? "danger" : "sage"} size="sm"
        onClick={() => handleApprove(u, !u.is_approved)}>
        {u.is_approved ? "Revoke" : "Approve"}
      </Btn>
    ) : null },
  ];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <SectionLabel>User Management</SectionLabel>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744" }}>
            All <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Users</em>
          </h1>
        </div>
        <Btn variant="sage" onClick={() => setModal(true)}>+ Add User</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {["admin","advocate","judge","client"].map(role => (
          <StatCard key={role} icon={<SketchUser size={22} />}
            label={role.charAt(0).toUpperCase()+role.slice(1)+"s"}
            value={roleCounts[role] || 0} />
        ))}
      </div>

      <Card noPad>
        <CardBody style={{ padding:"12px 18px", borderBottom:"1px solid #d6cfc2" }}>
          <div style={{ display:"flex", gap:10 }}>
            <SearchBar value={q} onChange={setQ} placeholder="Search name, username, email…" style={{ flex:1 }} />
            <select value={roleF} onChange={e=>setRoleF(e.target.value)} style={{
              padding:"8px 12px", border:"1.5px solid #d6cfc2", borderRadius:6,
              fontFamily:"'DM Sans',sans-serif", fontSize:"0.84rem", background:"#fff",
            }}>
              <option value="">All Roles</option>
              {["admin","advocate","judge","client"].map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </CardBody>
        {loading
          ? <div style={{ padding:40, textAlign:"center", color:"#7a7a8a" }}>Loading…</div>
          : <DataTable columns={cols} rows={users} empty="No users match your search." />
        }
        <div style={{ padding:"10px 16px", borderTop:"1px solid #ede8df", fontSize:"0.74rem", color:"#7a7a8a" }}>
          {users.length} users
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Add New User"
        footer={<>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn variant="sage"  onClick={saveUser} disabled={saving}>{saving ? "Creating…" : "Create User"}</Btn>
        </>}>
        <FormRow>
          <Input label="First Name *" id="fn" value={form.first_name} onChange={set("first_name")} required />
          <Input label="Last Name"    id="ln" value={form.last_name}  onChange={set("last_name")} />
        </FormRow>
        <Input label="Username *" id="un" value={form.username} onChange={set("username")} required />
        <Input label="Email *" id="em" type="email" value={form.email} onChange={set("email")} required />
        <Input label="Phone" id="ph" value={form.phone} onChange={set("phone")} />
        <FormRow>
          <Input label="Password *" id="pw" type="password" value={form.password} onChange={set("password")} required />
          <Select label="Role" id="rl" value={form.role} onChange={set("role")}>
            {["admin","advocate","judge","client"].map(r=><option key={r} value={r}>{r}</option>)}
          </Select>
        </FormRow>
      </Modal>
    </div>
  );
}

/* ════════════════════════════════════════
   PENDING APPROVALS
════════════════════════════════════════ */
export function PendingApprovalsPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    usersAPI.pendingClients()
      .then(r => setPending(r.data))
      .catch(() => toast("Failed to load.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const approve = async (user, val) => {
    try {
      await usersAPI.approve(user.id, { is_approved: val });
      toast(`${user.first_name} ${val ? "approved" : "declined"}.`, "success");
      load();
    } catch (err) {
      toast(getErrorMessage(err), "error");
    }
  };

  return (
    <div>
      <SectionLabel>Approvals</SectionLabel>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744", marginBottom:24 }}>
        Pending <em style={{ fontStyle:"italic", color:"#b8922a" }}>Approvals</em>
      </h1>

      {loading ? (
        <div style={{ padding:40, textAlign:"center", color:"#7a7a8a" }}>Loading…</div>
      ) : pending.length === 0 ? (
        <Card><EmptyState icon={<SketchBell size={64} />} title="All clear" desc="No pending client approvals." /></Card>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {pending.map(u => (
            <Card key={u.id} noPad>
              <CardBody style={{ padding:"18px 22px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{
                    width:46, height:46, borderRadius:"50%", background:"rgba(184,146,42,0.12)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"#b8922a", fontWeight:600,
                  }}>{u.first_name?.[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:500, color:"#1a1a2e", fontSize:"0.95rem" }}>{u.first_name} {u.last_name}</div>
                    <div style={{ fontSize:"0.78rem", color:"#7a7a8a" }}>{u.email} · @{u.username}</div>
                    {u.phone && <div style={{ fontSize:"0.78rem", color:"#7a7a8a" }}>{u.phone}</div>}
                    <div style={{ fontSize:"0.74rem", color:"#b0a898", marginTop:3 }}>Registered {u.created_at?.split("T")[0]}</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Btn variant="sage"  size="sm" onClick={() => approve(u, true)}>Approve Access</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => approve(u, false)}>Decline</Btn>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   AUDIT LOG
════════════════════════════════════════ */
const ACTION_COLORS = {
  login:           "#e3f0fb", view_case:"#e8f5e9", view_document:"#e8f5e9",
  upload_document: "#fdf8ef", edit_case:"#fdf8ef", approve_client:"#f0f7f5",
  revoke_client:   "#fce8e8",
};

export function AuditLogPage() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ]             = useState("");
  const [act, setAct]         = useState("");

  useEffect(() => {
    logsAPI.list({ action: act, user: q })
      .then(r => setLogs(r.data))
      .catch(() => toast("Failed to load logs.", "error"))
      .finally(() => setLoading(false));
  }, [q, act]);

  const actions = [...new Set(logs.map(l => l.action))];

  return (
    <div>
      <SectionLabel>System Audit</SectionLabel>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:"#1a2744", marginBottom:24 }}>
        Audit <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Log</em>
      </h1>

      <Card noPad style={{ marginBottom:14 }}>
        <CardBody style={{ padding:"12px 18px" }}>
          <div style={{ display:"flex", gap:10 }}>
            <SearchBar value={q} onChange={setQ} placeholder="Filter by username…" style={{ flex:1 }} />
            <select value={act} onChange={e=>setAct(e.target.value)} style={{
              padding:"8px 12px", border:"1.5px solid #d6cfc2", borderRadius:6,
              fontFamily:"'DM Sans',sans-serif", fontSize:"0.84rem", background:"#fff",
            }}>
              <option value="">All Actions</option>
              {actions.map(a=><option key={a} value={a}>{a.replace(/_/g," ")}</option>)}
            </select>
          </div>
        </CardBody>
      </Card>

      <Card noPad>
        {loading
          ? <div style={{ padding:40, textAlign:"center", color:"#7a7a8a" }}>Loading…</div>
          : logs.length === 0
            ? <EmptyState icon={<SketchDoc size={64} />} title="No log entries" desc="No events match your filter." />
            : logs.map((log, i) => (
              <div key={log.id} style={{
                display:"flex", alignItems:"center", gap:14, padding:"12px 18px",
                borderBottom: i < logs.length-1 ? "1px solid #ede8df":"none",
                background: ACTION_COLORS[log.action] || "#fff",
              }}>
                <div style={{
                  width:34, height:34, borderRadius:"50%", background:"rgba(74,124,111,0.12)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Cormorant Garamond',serif", fontSize:"0.95rem", color:"#4a7c6f", fontWeight:600, flexShrink:0,
                }}>{log.user_name?.[0] || "?"}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.84rem", fontWeight:500, color:"#1a1a2e" }}>{log.user_name}</div>
                  <div style={{ fontSize:"0.78rem", color:"#7a7a8a" }}>{log.description}</div>
                </div>
                <Badge label={log.action.replace(/_/g," ")} variant="approved" />
                <div style={{ fontSize:"0.74rem", color:"#b0a898", whiteSpace:"nowrap", flexShrink:0 }}>
                  {new Date(log.timestamp).toLocaleString("en-IN", { dateStyle:"short", timeStyle:"short" })}
                </div>
              </div>
            ))
        }
        <div style={{ padding:"10px 18px", borderTop:"1px solid #ede8df", fontSize:"0.74rem", color:"#7a7a8a" }}>
          {logs.length} entries (last 200)
        </div>
      </Card>
    </div>
  );
}
