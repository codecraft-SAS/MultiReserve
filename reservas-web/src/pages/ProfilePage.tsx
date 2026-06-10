import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, ShieldAlert, ShieldCheck, Edit3, Save, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { colors, layout, buttons, loadingSpinner } from "../utils/colors";

export function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ ...loadingSpinner.container, minHeight: "100vh", backgroundColor: colors.bgApp, flexDirection: "column", gap: "16px" }}>
        <div style={loadingSpinner.spinner} />
        <span style={{ fontSize: "13px", color: colors.textMuted, fontWeight: 500 }}>Cargando credenciales...</span>
      </div>
    );
  }

  const getRoleTheme = (role: string) => {
    switch (role) {
      case "ADMIN":
        return {
          bg: "rgba(239, 68, 68, 0.07)",
          text: "#f87171",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          icon: <ShieldAlert size={16} style={{ color: "#f87171" }} />
        };
      case "EMPLOYEE":
        return {
          bg: "rgba(245, 158, 11, 0.07)",
          text: "#fbbf24",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          icon: <Shield size={16} style={{ color: "#fbbf24" }} />
        };
      default:
        return {
          bg: "rgba(16, 185, 129, 0.07)",
          text: "#34d399",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          icon: <ShieldCheck size={16} style={{ color: "#34d399" }} />
        };
    }
  };

  const theme = getRoleTheme(user.role);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      return toast.error("Los campos no pueden estar vacíos");
    }

    setIsSaving(true);
    try {
      await updateUser(fullName, email);
      toast.success("¡Perfil actualizado con éxito!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error al actualizar los datos en el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFullName(user.fullName);
    setEmail(user.email);
  };

  return (
    <div style={{ ...layout.page, maxWidth: "600px", margin: "0 auto", padding: "40px 40px" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: "24px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={layout.header}>
          <div style={layout.headerRow}>
            <div style={{ backgroundColor: colors.bgCardAlt, padding: "8px", borderRadius: "12px", border: `1px solid ${colors.border}`, display: "flex" }}>
              <User size={20} style={{ color: colors.primaryLight }} />
            </div>
            <h1 style={layout.title}>Mi Perfil</h1>
          </div>
          <p style={layout.description}>
            Gestiona y visualiza la información de tu cuenta.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: colors.bgApp, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "10px 16px", color: colors.textSecondary, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
            >
              <Edit3 size={14} style={{ color: colors.primaryLight }} />
              <span>Editar datos</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", padding: "10px 16px", color: colors.danger, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
            >
              <X size={14} />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSave} style={{ ...layout.card, position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Nombre Completo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: colors.textMuted }}>Nombre de Usuario</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: colors.glass,
              border: isEditing ? `1px solid ${colors.primaryLight}` : `1px solid ${colors.borderSubtle}`,
              borderRadius: "10px",
              padding: "12px",
              boxShadow: isEditing ? "0 0 10px rgba(59, 130, 246, 0.15)" : "none",
              transition: "all 0.2s ease"
            }}>
              <User size={16} style={{ color: isEditing ? colors.primaryLight : colors.textDimmer, flexShrink: 0 }} />
              <input
                type="text"
                disabled={!isEditing}
                value={isEditing ? fullName : user.fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre de usuario"
                style={{
                  width: "100%",
                  fontSize: "14px",
                  color: isEditing ? colors.textPrimary : colors.textSecondary,
                  fontWeight: 500,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  cursor: isEditing ? "text" : "not-allowed"
                }}
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: colors.textMuted }}>Dirección de Correo</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: colors.glass,
              border: isEditing ? `1px solid ${colors.primaryLight}` : `1px solid ${colors.borderSubtle}`,
              borderRadius: "10px",
              padding: "12px",
              boxShadow: isEditing ? "0 0 10px rgba(59, 130, 246, 0.15)" : "none",
              transition: "all 0.2s ease"
            }}>
              <Mail size={16} style={{ color: isEditing ? colors.primaryLight : colors.textDimmer, flexShrink: 0 }} />
              <input
                type="email"
                disabled={!isEditing}
                value={isEditing ? email : user.email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                style={{
                  width: "100%",
                  fontSize: "14px",
                  color: isEditing ? colors.textPrimary : colors.textSecondary,
                  fontWeight: 500,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  cursor: isEditing ? "text" : "not-allowed"
                }}
              />
            </div>
          </div>

          {/* Nivel de Acceso / Rol */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: colors.textMuted }}>Nivel de Autorización (Rol)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: colors.glass, border: `1px solid ${colors.borderSubtle}`, borderRadius: "10px", padding: "12px", opacity: 0.8 }}>
              {theme.icon}
              <span style={{
                backgroundColor: theme.bg,
                color: theme.text,
                border: theme.border,
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "0.05em"
              }}>
                {user.role === "CLIENT" ? "CLIENTE FINAL" : user.role}
              </span>
            </div>
          </div>

          {/* Botón de Guardar */}
          {isEditing && (
            <button
              type="submit"
              disabled={isSaving}
              style={{
                ...buttons.primary,
                width: "100%",
                justifyContent: "center",
                marginTop: "8px",
                backgroundColor: isSaving ? colors.primaryDark : colors.primary,
                gap: "8px",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Guardando cambios...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Guardar Cambios Permanentes</span>
                </>
              )}
            </button>
          )}

        </div>

        <div style={{ position: "absolute", bottom: "-20px", right: "-20px", opacity: 0.02, color: colors.textPrimary, pointerEvents: "none" }}>
          <User size={180} />
        </div>
      </form>
    </div>
  );
}
