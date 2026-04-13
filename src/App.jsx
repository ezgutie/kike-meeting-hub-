import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

const ADMIN_EMAIL = "e.gonzalez@onmi.es";

const CATEGORIES = [
  { id: "code_review", label: "Code Review", icon: "🔍" },
  { id: "planning", label: "Planificación", icon: "📋" },
  { id: "bug", label: "Bug / Incidencia", icon: "🐛" },
  { id: "consultation", label: "Consulta General", icon: "💬" },
  { id: "deployment", label: "Deploy / Release", icon: "🚀" },
  { id: "other", label: "Otro", icon: "📌" },
];

const PRIORITIES = [
  { id: "low", label: "Baja", color: "#4a9e6e", bg: "#e8f5ee" },
  { id: "medium", label: "Media", color: "#c48a1a", bg: "#fef7e6" },
  { id: "high", label: "Alta", color: "#c0392b", bg: "#fdeaea" },
];

const STATUSES = [
  { id: "pending", label: "Pendiente", color: "#c48a1a", bg: "#fef7e6", icon: "⏳" },
  { id: "accepted", label: "Aceptada", color: "#27855a", bg: "#e8f5ee", icon: "✅" },
  { id: "rejected", label: "Rechazada", color: "#c0392b", bg: "#fdeaea", icon: "❌" },
];

function formatDate(ts) {
  const d = new Date(ts);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${h}:${m}`;
}

/* ═══════════════════════════════════════
   Supabase helpers
   ═══════════════════════════════════════ */

async function loadMeetings() {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error loading meetings:", error);
    return [];
  }
  return data || [];
}

async function createMeeting(meeting) {
  const { error } = await supabase.from("meetings").insert([meeting]);
  if (error) console.error("Error creating meeting:", error);
  return !error;
}

async function updateMeeting(id, updates) {
  const { error } = await supabase
    .from("meetings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Error updating meeting:", error);
  return !error;
}

/* ═══════════════════════════════════════
   Components
   ═══════════════════════════════════════ */

function Header({ view, setView, isAdmin, onLogout, userName }) {
  return (
    <header style={s.header}>
      <div style={s.headerInner}>
        <div style={s.logoArea}>
          <div style={s.logoMark}>K</div>
          <div>
            <div style={s.logoTitle}>Kike Meeting Hub</div>
            <div style={s.logoSub}>ONMI Engineering</div>
          </div>
        </div>
        <nav style={s.nav}>
          {!isAdmin && (
            <>
              <button
                onClick={() => setView("form")}
                style={{ ...s.navBtn, ...(view === "form" ? s.navBtnActive : {}) }}
              >
                Nueva Solicitud
              </button>
              <button
                onClick={() => setView("my")}
                style={{ ...s.navBtn, ...(view === "my" ? s.navBtnActive : {}) }}
              >
                Mis Solicitudes
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => setView("admin")}
              style={{ ...s.navBtn, ...(view === "admin" ? s.navBtnActive : {}) }}
            >
              Panel de Kike
            </button>
          )}
          <span style={s.userName}>{userName}</span>
          <button onClick={onLogout} style={s.logoutBtn}>Salir</button>
        </nav>
      </div>
    </header>
  );
}

function SplashScreen({ onEnter }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 700);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0f1923",
      transition: "opacity 0.7s ease",
      opacity: exiting ? 0 : 1,
    }}>
      {/* Spline 3D background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <spline-viewer
          url="https://prod.spline.design/n6Y2sUx35oFbgT6E/scene.splinecode"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      {/* Overlay content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end",
        paddingBottom: "8vh",
        background: "linear-gradient(to bottom, transparent 40%, rgba(15,25,35,0.6) 70%, rgba(15,25,35,0.92) 100%)",
        transition: "opacity 0.8s ease",
        opacity: visible ? 1 : 0,
      }}>
        <div style={{
          textAlign: "center",
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            marginBottom: 12,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #2ecc71, #1abc9c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 26, color: "#0f1923",
              fontFamily: "'DM Sans', sans-serif",
            }}>K</div>
            <div style={{ textAlign: "left" }}>
              <div style={{
                fontSize: 28, fontWeight: 800, color: "#e8ecf0",
                letterSpacing: "-0.5px", fontFamily: "'DM Sans', sans-serif",
              }}>Kike Meeting Hub</div>
              <div style={{
                fontSize: 11, color: "#5a8a70", letterSpacing: "2px",
                textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
              }}>ONMI Engineering</div>
            </div>
          </div>

          <p style={{
            color: "#7a9bb5", fontSize: 15, marginBottom: 32,
            maxWidth: 400, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif",
          }}>
            Solicita y gestiona reuniones con Kike.<br />
            Todo el equipo, un solo punto de entrada.
          </p>

          <button onClick={handleEnter} style={{
            padding: "14px 48px", borderRadius: 12,
            border: "1px solid rgba(46,204,113,0.4)",
            background: "rgba(46,204,113,0.12)",
            color: "#2ecc71", fontSize: 16, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.3s ease",
            backdropFilter: "blur(8px)",
            letterSpacing: "0.3px",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "linear-gradient(135deg, #2ecc71, #1abc9c)";
            e.target.style.color = "#0f1923";
            e.target.style.borderColor = "transparent";
            e.target.style.transform = "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(46,204,113,0.12)";
            e.target.style.color = "#2ecc71";
            e.target.style.borderColor = "rgba(46,204,113,0.4)";
            e.target.style.transform = "scale(1)";
          }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return setError("Rellena nombre y correo");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Email no válido");
    onLogin(name.trim(), email.trim().toLowerCase());
  };

  return (
    <div style={s.loginBg}>
      <div style={s.loginCard}>
        <div style={s.loginLogoMark}>K</div>
        <h1 style={s.loginTitle}>Kike Meeting Hub</h1>
        <p style={s.loginSub}>
          Solicita una reunión con Kike — introduce tu nombre y correo para continuar.
        </p>
        {error && <div style={s.errorMsg}>{error}</div>}

        <label style={s.label}>Nombre</label>
        <input
          style={s.input}
          placeholder="Tu nombre completo"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <label style={s.label}>Correo electrónico</label>
        <input
          style={s.input}
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button style={s.primaryBtn} onClick={handleSubmit}>Entrar</button>
        <p style={s.loginHint}>
          Si eres Kike, entra con <strong>e.gonzalez@onmi.es</strong> para ver el panel de administración.
        </p>
      </div>
    </div>
  );
}

function MeetingForm({ user, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [category, setCategory] = useState("consultation");
  const [priority, setPriority] = useState("medium");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return setError("El título es obligatorio");
    if (!hours || parseFloat(hours) <= 0) return setError("Indica las horas (mayor a 0)");
    setSubmitting(true);

    const ok = await createMeeting({
      title: title.trim(),
      description: description.trim(),
      hours: parseFloat(hours),
      category,
      priority,
      status: "pending",
      admin_comment: "",
      requester_name: user.name,
      requester_email: user.email,
    });

    setSubmitting(false);
    if (ok) {
      setTitle(""); setDescription(""); setHours("");
      setCategory("consultation"); setPriority("medium"); setError("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onCreated();
    } else {
      setError("Error al enviar. Inténtalo de nuevo.");
    }
  };

  return (
    <div style={s.formCard}>
      <h2 style={s.cardTitle}>Nueva Solicitud de Reunión</h2>
      <p style={s.cardSub}>Describe lo que necesitas discutir con Kike y cuánto tiempo estimas.</p>

      {error && <div style={s.errorMsg}>{error}</div>}
      {success && <div style={s.successMsg}>✅ Solicitud enviada. Kike la revisará pronto.</div>}

      <label style={s.label}>Título *</label>
      <input style={s.input} placeholder="Ej: Revisión módulo onmi_lot_management" value={title}
        onChange={(e) => { setTitle(e.target.value); setError(""); }} />

      <label style={s.label}>Descripción</label>
      <textarea style={{ ...s.input, minHeight: 140, resize: "vertical" }}
        placeholder="Describe en detalle lo que necesitas discutir. Sin límite de extensión..."
        value={description} onChange={(e) => setDescription(e.target.value)} />

      <div style={s.row}>
        <div style={{ flex: 1 }}>
          <label style={s.label}>Horas estimadas *</label>
          <input style={s.input} type="number" min="0.25" step="0.25" placeholder="Ej: 1.5"
            value={hours} onChange={(e) => { setHours(e.target.value); setError(""); }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={s.label}>Prioridad</label>
          <div style={s.pillRow}>
            {PRIORITIES.map((p) => (
              <button key={p.id} onClick={() => setPriority(p.id)}
                style={{ ...s.pill, background: priority === p.id ? p.color : p.bg,
                  color: priority === p.id ? "#fff" : p.color, borderColor: p.color }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label style={s.label}>Categoría</label>
      <div style={s.catGrid}>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            style={{ ...s.catBtn, ...(category === c.id ? s.catBtnActive : {}) }}>
            <span style={{ fontSize: 18 }}>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <button style={s.primaryBtn} onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar Solicitud"}
      </button>
    </div>
  );
}

function MeetingCard({ meeting, isAdmin, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState(meeting.admin_comment || "");
  const [saving, setSaving] = useState(false);
  const cat = CATEGORIES.find((c) => c.id === meeting.category) || CATEGORIES[5];
  const pri = PRIORITIES.find((p) => p.id === meeting.priority) || PRIORITIES[1];
  const sta = STATUSES.find((st) => st.id === meeting.status) || STATUSES[0];

  const handleStatus = async (newStatus) => {
    setSaving(true);
    await updateMeeting(meeting.id, { status: newStatus, admin_comment: comment });
    setSaving(false);
    onUpdate();
  };

  const handleSaveComment = async () => {
    setSaving(true);
    await updateMeeting(meeting.id, { admin_comment: comment });
    setSaving(false);
    onUpdate();
  };

  return (
    <div style={{ ...s.meetingCard, borderLeft: `4px solid ${sta.color}` }}
      onClick={() => setExpanded(!expanded)}>
      <div style={s.meetingTop}>
        <div style={{ flex: 1 }}>
          <div style={s.meetingHeader}>
            <span style={s.meetingTitle}>{meeting.title}</span>
          </div>
          <div style={s.meetingMeta}>
            <span style={{ ...s.badge, background: sta.bg, color: sta.color }}>
              {sta.icon} {sta.label}
            </span>
            <span style={{ ...s.badge, background: pri.bg, color: pri.color }}>
              {pri.label}
            </span>
            <span style={s.badgeNeutral}>{cat.icon} {cat.label}</span>
            <span style={s.badgeNeutral}>⏱ {meeting.hours}h</span>
            {isAdmin && <span style={s.badgeNeutral}>👤 {meeting.requester_name}</span>}
          </div>
        </div>
        <div style={s.meetingDate}>{formatDate(meeting.created_at)}</div>
      </div>

      {expanded && (
        <div style={s.meetingExpanded} onClick={(e) => e.stopPropagation()}>
          {meeting.description && (
            <div style={s.descriptionBlock}>
              <div style={s.descLabel}>Descripción</div>
              <div style={s.descText}>{meeting.description}</div>
            </div>
          )}

          {isAdmin && (
            <div style={s.adminBlock}>
              <div style={s.descLabel}>Respuesta de Kike</div>
              <textarea style={{ ...s.input, minHeight: 70, resize: "vertical", marginBottom: 10 }}
                placeholder="Escribe un comentario o respuesta..."
                value={comment} onChange={(e) => setComment(e.target.value)} />
              <div style={s.adminActions}>
                <button disabled={saving} style={{ ...s.statusBtn, background: "#27855a", color: "#fff" }}
                  onClick={() => handleStatus("accepted")}>✅ Aceptar</button>
                <button disabled={saving} style={{ ...s.statusBtn, background: "#c0392b", color: "#fff" }}
                  onClick={() => handleStatus("rejected")}>❌ Rechazar</button>
                <button disabled={saving} style={{ ...s.statusBtn, background: "#555", color: "#fff" }}
                  onClick={() => handleStatus("pending")}>⏳ Pendiente</button>
                <button disabled={saving} style={{ ...s.statusBtn, background: "#1a5276", color: "#fff" }}
                  onClick={handleSaveComment}>💬 Solo Comentar</button>
              </div>
            </div>
          )}

          {!isAdmin && meeting.admin_comment && (
            <div style={s.commentBlock}>
              <div style={s.descLabel}>Respuesta de Kike</div>
              <div style={s.descText}>{meeting.admin_comment}</div>
            </div>
          )}

          <div style={s.metaFooter}>
            <span>Solicitante: {meeting.requester_name} ({meeting.requester_email})</span>
            <span>Última actualización: {formatDate(meeting.updated_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function MeetingList({ meetings, isAdmin, onUpdate, emptyMsg }) {
  if (!meetings.length) return <div style={s.empty}>{emptyMsg || "No hay solicitudes."}</div>;
  return (
    <div style={s.listWrap}>
      {meetings.map((m) => (
        <MeetingCard key={m.id} meeting={m} isAdmin={isAdmin} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

function AdminDashboard({ meetings, onUpdate }) {
  const [filter, setFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = meetings.filter((m) => {
    if (filter !== "all" && m.status !== filter) return false;
    if (catFilter !== "all" && m.category !== catFilter) return false;
    return true;
  });

  const counts = {
    all: meetings.length,
    pending: meetings.filter((m) => m.status === "pending").length,
    accepted: meetings.filter((m) => m.status === "accepted").length,
    rejected: meetings.filter((m) => m.status === "rejected").length,
  };
  const hPending = meetings.filter((m) => m.status === "pending").reduce((a, m) => a + m.hours, 0);
  const hAccepted = meetings.filter((m) => m.status === "accepted").reduce((a, m) => a + m.hours, 0);

  return (
    <div>
      <h2 style={s.cardTitle}>Panel de Kike</h2>
      <div style={s.statsRow}>
        <div style={{ ...s.statBox, borderTop: "3px solid #c48a1a" }}>
          <div style={s.statNum}>{counts.pending}</div>
          <div style={s.statLabel}>Pendientes</div>
          <div style={s.statExtra}>{hPending}h estimadas</div>
        </div>
        <div style={{ ...s.statBox, borderTop: "3px solid #27855a" }}>
          <div style={s.statNum}>{counts.accepted}</div>
          <div style={s.statLabel}>Aceptadas</div>
          <div style={s.statExtra}>{hAccepted}h comprometidas</div>
        </div>
        <div style={{ ...s.statBox, borderTop: "3px solid #c0392b" }}>
          <div style={s.statNum}>{counts.rejected}</div>
          <div style={s.statLabel}>Rechazadas</div>
        </div>
        <div style={{ ...s.statBox, borderTop: "3px solid #34495e" }}>
          <div style={s.statNum}>{counts.all}</div>
          <div style={s.statLabel}>Total</div>
        </div>
      </div>

      <div style={s.filterRow}>
        <span style={s.filterLabel}>Estado:</span>
        {[{ id: "all", label: "Todas" }, ...STATUSES].map((st) => (
          <button key={st.id} onClick={() => setFilter(st.id)}
            style={{ ...s.filterBtn, ...(filter === st.id ? s.filterBtnActive : {}) }}>
            {st.icon ? `${st.icon} ` : ""}{st.label}
          </button>
        ))}
        <span style={{ ...s.filterLabel, marginLeft: 20 }}>Categoría:</span>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={s.select}>
          <option value="all">Todas</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
      </div>

      <MeetingList meetings={filtered} isAdmin={true} onUpdate={onUpdate}
        emptyMsg="No hay solicitudes con estos filtros." />
    </div>
  );
}

function MyMeetings({ meetings, userEmail, onUpdate }) {
  const mine = meetings.filter((m) => m.requester_email === userEmail);
  return (
    <div>
      <h2 style={s.cardTitle}>Mis Solicitudes</h2>
      <p style={s.cardSub}>Haz clic en una solicitud para ver los detalles y la respuesta de Kike.</p>
      <MeetingList meetings={mine} isAdmin={false} onUpdate={onUpdate}
        emptyMsg="Aún no has enviado ninguna solicitud." />
    </div>
  );
}

/* ═══════════════════════════════════════
   Main App
   ═══════════════════════════════════════ */

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("kmh_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [showSplash, setShowSplash] = useState(() => {
    try { return !sessionStorage.getItem("kmh_user"); } catch { return true; }
  });
  const [view, setView] = useState("form");
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const refresh = useCallback(async () => {
    const data = await loadMeetings();
    setMeetings(data);
  }, []);

  useEffect(() => {
    if (user) {
      loadMeetings().then((data) => { setMeetings(data); setLoading(false); });
      // Auto-refresh every 30s
      const interval = setInterval(refresh, 30000);
      return () => clearInterval(interval);
    }
  }, [user, refresh]);

  useEffect(() => {
    if (isAdmin && view === "form") setView("admin");
  }, [isAdmin, view]);

  const handleLogin = (name, email) => {
    const u = { name, email };
    setUser(u);
    try { sessionStorage.setItem("kmh_user", JSON.stringify(u)); } catch {}
    if (email === ADMIN_EMAIL) setView("admin");
    else setView("form");
    refresh();
  };

  const handleLogout = () => {
    setUser(null);
    setView("form");
    try { sessionStorage.removeItem("kmh_user"); } catch {}
  };

  if (showSplash && !user) return <SplashScreen onEnter={() => setShowSplash(false)} />;
  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (loading) return (
    <div style={s.loginBg}>
      <div style={{ ...s.loginCard, textAlign: "center" }}>
        <div style={s.loginLogoMark}>K</div>
        <p style={{ color: "#7a9bb5" }}>Cargando solicitudes...</p>
      </div>
    </div>
  );

  return (
    <div style={s.appBg}>
      <Header view={view} setView={setView} isAdmin={isAdmin}
        onLogout={handleLogout} userName={user.name} />
      <main style={s.main}>
        {view === "form" && !isAdmin && <MeetingForm user={user} onCreated={refresh} />}
        {view === "my" && !isAdmin && <MyMeetings meetings={meetings} userEmail={user.email} onUpdate={refresh} />}
        {view === "admin" && isAdmin && <AdminDashboard meetings={meetings} onUpdate={refresh} />}
      </main>
      <footer style={s.footer}>ONMI Engineering · Kike Meeting Hub · {new Date().getFullYear()}</footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   Styles
   ═══════════════════════════════════════ */

const s = {
  appBg: { minHeight: "100vh", background: "linear-gradient(168deg, #0f1923 0%, #1a2a3a 40%, #1e3345 100%)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e8ecf0" },
  header: { background: "rgba(15,25,35,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 },
  headerInner: { maxWidth: 960, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  logoArea: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #2ecc71, #1abc9c)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "#0f1923", flexShrink: 0 },
  logoTitle: { fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" },
  logoSub: { fontSize: 11, color: "#7a9bb5", letterSpacing: "1.5px", textTransform: "uppercase" },
  nav: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" },
  navBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#a0b8cc", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s" },
  navBtnActive: { background: "rgba(46,204,113,0.15)", borderColor: "#2ecc71", color: "#2ecc71" },
  userName: { fontSize: 12, color: "#5a7a90", padding: "0 8px" },
  logoutBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "#6a8498", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 },
  main: { maxWidth: 960, margin: "0 auto", padding: "30px 24px 60px" },

  // Login
  loginBg: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(168deg, #0f1923 0%, #1a2a3a 40%, #1e3345 100%)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: 24 },
  loginCard: { background: "rgba(22,36,50,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "44px 36px", maxWidth: 420, width: "100%", color: "#e8ecf0", backdropFilter: "blur(20px)" },
  loginLogoMark: { width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #2ecc71, #1abc9c)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28, color: "#0f1923", marginBottom: 20 },
  loginTitle: { fontSize: 26, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" },
  loginSub: { color: "#7a9bb5", fontSize: 14, marginBottom: 28, lineHeight: 1.5 },
  loginHint: { marginTop: 20, fontSize: 12, color: "#5a7a90", textAlign: "center", lineHeight: 1.5 },

  // Form
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#7a9bb5", marginBottom: 6, marginTop: 18, textTransform: "uppercase", letterSpacing: "0.8px" },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e8ecf0", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit" },
  primaryBtn: { width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #2ecc71, #1abc9c)", color: "#0f1923", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 24, transition: "opacity 0.2s" },
  row: { display: "flex", gap: 20, flexWrap: "wrap" },
  pillRow: { display: "flex", gap: 8, marginTop: 4 },
  pill: { padding: "6px 14px", borderRadius: 20, border: "1px solid", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginTop: 4 },
  catBtn: { display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#a0b8cc", fontSize: 13, cursor: "pointer", transition: "all 0.2s" },
  catBtnActive: { background: "rgba(46,204,113,0.12)", borderColor: "#2ecc71", color: "#2ecc71" },

  // Cards
  formCard: { background: "rgba(22,36,50,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "32px 28px", backdropFilter: "blur(12px)" },
  cardTitle: { fontSize: 22, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.3px", color: "#e8ecf0" },
  cardSub: { color: "#7a9bb5", fontSize: 14, marginBottom: 10 },

  // Meeting cards
  meetingCard: { background: "rgba(22,36,50,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px", marginBottom: 10, cursor: "pointer", transition: "background 0.2s" },
  meetingTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  meetingHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  meetingTitle: { fontWeight: 600, fontSize: 15 },
  meetingMeta: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  meetingDate: { fontSize: 12, color: "#5a7a90", whiteSpace: "nowrap", marginTop: 2 },
  badge: { padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 },
  badgeNeutral: { padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: "rgba(255,255,255,0.06)", color: "#8aa8bc" },
  meetingExpanded: { marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" },
  descriptionBlock: { marginBottom: 16 },
  descLabel: { fontSize: 11, fontWeight: 600, color: "#5a7a90", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 },
  descText: { fontSize: 14, color: "#c0d0dc", lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" },
  adminBlock: { marginBottom: 16 },
  adminActions: { display: "flex", gap: 8, flexWrap: "wrap" },
  statusBtn: { padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s" },
  commentBlock: { background: "rgba(46,204,113,0.06)", border: "1px solid rgba(46,204,113,0.15)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 },
  metaFooter: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a6a80", flexWrap: "wrap", gap: 8 },

  // Stats
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24, marginTop: 16 },
  statBox: { background: "rgba(22,36,50,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 16px", textAlign: "center" },
  statNum: { fontSize: 32, fontWeight: 800, letterSpacing: "-1px", color: "#e8ecf0" },
  statLabel: { fontSize: 12, color: "#7a9bb5", marginTop: 2, fontWeight: 500 },
  statExtra: { fontSize: 11, color: "#4a6a80", marginTop: 4 },

  // Filters
  filterRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 18 },
  filterLabel: { fontSize: 12, fontWeight: 600, color: "#5a7a90" },
  filterBtn: { padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#8aa8bc", fontSize: 12, fontWeight: 500, cursor: "pointer" },
  filterBtnActive: { background: "rgba(46,204,113,0.15)", borderColor: "#2ecc71", color: "#2ecc71" },
  select: { padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#a0b8cc", fontSize: 12 },

  // Misc
  listWrap: { marginTop: 8 },
  empty: { textAlign: "center", color: "#5a7a90", padding: "60px 20px", fontSize: 14 },
  errorMsg: { background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.3)", color: "#e74c3c", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 10 },
  successMsg: { background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.25)", color: "#2ecc71", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 10 },
  footer: { textAlign: "center", padding: "30px 20px", fontSize: 11, color: "#3a5a70", letterSpacing: "0.5px" },
};
