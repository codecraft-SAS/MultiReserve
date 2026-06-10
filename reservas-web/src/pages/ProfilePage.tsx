import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, ShieldAlert, ShieldCheck, Edit3, Save, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  // Consumimos el estado global y la función de actualización del contexto
  const { user, updateUser } = useAuth();

  // Estados locales para la gestión de la edición
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Pantalla de carga segura
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center py-32 gap-4 bg-[#09090b] min-h-screen" style={{ backgroundColor: '#09090b', minHeight: '100vh' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-800 border-t-blue-500"></div>
        <span className="text-xs text-zinc-400 font-medium">Cargando credenciales...</span>
      </div>
    );
  }

  // Estilos dinámicos para el escudo de seguridad según el rol
  const getRoleTheme = (role: string) => {
    switch (role) {
      case "ADMIN":
        return {
          bg: "rgba(239, 68, 68, 0.07)",
          text: "#f87171",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          icon: <ShieldAlert size={16} className="text-red-400" style={{ color: '#f87171' }} />
        };
      case "EMPLOYEE":
        return {
          bg: "rgba(245, 158, 11, 0.07)",
          text: "#fbbf24",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          icon: <Shield size={16} className="text-amber-400" style={{ color: '#fbbf24' }} />
        };
      default:
        return {
          bg: "rgba(16, 185, 129, 0.07)",
          text: "#34d399",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          icon: <ShieldCheck size={16} className="text-emerald-400" style={{ color: '#34d399' }} />
        };
    }
  };

  const theme = getRoleTheme(user.role);

  // Acción para enviar los datos modificados al Backend
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
    } catch {
      toast.error("Error al actualizar los datos en el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancelar edición y reestablecer valores
  const handleCancel = () => {
    setIsEditing(false);
    setFullName(user.fullName);
    setEmail(user.email);
  };

  return (
    <div className="min-h-screen bg-[#09090b] px-4 py-6 text-white sm:px-6 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      
      {/* ─── ENCABEZADO CON BOTÓN INTERACTIVO CORREGIDO ─── */}
      <div className="flex flex-col justify-between gap-5 border-b border-zinc-800/70 pb-6 sm:flex-row sm:items-center" style={{ borderBottom: '1px solid #27272a' }}>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
              <User className="text-blue-500" size={20} style={{ color: '#3b82f6' }} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Mi Perfil
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-zinc-400" style={{ color: '#a1a1aa' }}>
            Gestiona y visualiza la información de tu cuenta con la que accedes al ecosistema MultiReserve.
          </p>
        </div>

        {/* 🚀 Contenedor aislado de botones con Keys estables para blindar el DOM virtual */}
        <div className="flex items-center self-start sm:self-auto">
          {!isEditing ? (
            <button
              key="btn-editar-datos"
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
              style={{ cursor: 'pointer' }}
            >
              <Edit3 size={14} className="text-blue-500" />
              <span>Editar datos</span>
            </button>
          ) : (
            <button
              key="btn-cancelar-edicion"
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 bg-red-950/20 border border-red-900/40 hover:bg-red-950/40 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
              style={{ cursor: 'pointer' }}
            >
              <X size={14} />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── FORMULARIO / TARJETA CONTENEDORA DE CREDENCIALES ─── */}
      <form onSubmit={handleSave} className="relative overflow-hidden rounded-3xl border border-zinc-800/70 bg-[#121214] p-6 shadow-2xl sm:p-8"
            style={{ backgroundColor: '#121214', border: '1px solid #27272a', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}>
        
        <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Campo: Nombre Completo */}
          <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              Nombre de Usuario
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: '#09090b', 
              border: isEditing ? '1px solid #3b82f6' : '1px solid #1c1c1f', 
              padding: '14px', 
              borderRadius: '10px',
              boxShadow: isEditing ? '0 0 10px rgba(59, 130, 246, 0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <User size={16} style={{ color: isEditing ? '#3b82f6' : '#52525b' }} />
              <input 
                type="text"
                disabled={!isEditing}
                value={isEditing ? fullName : user.fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Mariana López"
                className="w-full bg-transparent border-none outline-none p-0 focus:ring-0"
                style={{ 
                  fontSize: '14px', 
                  color: isEditing ? '#ffffff' : '#f4f4f5', 
                  fontWeight: 500,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>
          </div>

          {/* Campo: Correo Electrónico */}
          <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              Dirección de Correo
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: '#09090b', 
              border: isEditing ? '1px solid #3b82f6' : '1px solid #1c1c1f', 
              padding: '14px', 
              borderRadius: '10px',
              boxShadow: isEditing ? '0 0 10px rgba(59, 130, 246, 0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <Mail size={16} style={{ color: isEditing ? '#3b82f6' : '#52525b' }} />
              <input 
                type="email"
                disabled={!isEditing}
                value={isEditing ? email : user.email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej: mariana@multireserve.com"
                className="w-full bg-transparent border-none outline-none p-0 focus:ring-0"
                style={{ 
                  fontSize: '14px', 
                  color: isEditing ? '#ffffff' : '#f4f4f5', 
                  fontWeight: 500,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
            </div>
          </div>

          {/* Campo: Nivel de Acceso / Rol (Lectura Única Siempre) */}
          <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              Nivel de Autorización (Rol)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#09090b', border: '1px solid #1c1c1f', padding: '14px', borderRadius: '10px', opacity: 0.8 }}>
              {theme.icon}
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{ 
                      backgroundColor: theme.bg, 
                      color: theme.text,
                      border: theme.border,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em'
                    }}>
                {user.role === "CLIENT" ? "CLIENTE FINAL" : user.role}
              </span>
            </div>
          </div>

          {/* Botón de envío dinámico cuando está en edición */}
          {isEditing && (
            <button
              type="submit"
              disabled={isSaving}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white py-3 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-[0.99]"
              style={{ cursor: isSaving ? 'not-allowed' : 'pointer' }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
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

        {/* Detalle estético sutil de fondo */}
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.02, color: '#ffffff', pointerEvents: 'none' }}>
          <User size={180} />
        </div>

      </form>
      </div>
    </div>
  );
}