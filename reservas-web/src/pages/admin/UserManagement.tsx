import { useState, useEffect } from "react";
import { 
  Users, Plus, Search, ShieldCheck, UserCog, User, 
  Mail, Shield, X, Edit2, Trash2 
} from "lucide-react";
import toast from "react-hot-toast";

// 🌟 Importamos todas las funciones necesarias conectadas al backend
import { 
  getAllUsers, 
  createUserFromAdmin, 
  updateUserFromAdmin, 
  deleteUserFromAdmin 
} from "../../services/userService"; 

interface UserSystem {
  id?: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE" | "CLIENT";
  password?: string;
}

export default function UserManagement() {
  // Estados operativos
  const [users, setUsers] = useState<UserSystem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Estados del Formulario
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EMPLOYEE" | "CLIENT">("EMPLOYEE");

  // 🌟 Lectura inicial directa de la base de datos
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al traer usuarios:", error);
      toast.error("No se pudieron cargar los usuarios del servidor.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrado predictivo en barra de búsqueda
  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setSelectedUserId(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("EMPLOYEE");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserSystem) => {
    setIsEditing(true);
    setSelectedUserId(user.id || null);
    setFullName(user.fullName);
    setEmail(user.email);
    setPassword(""); 
    setRole(user.role);
    setIsModalOpen(true);
  };

  // 🌟 ELIMINAR CONECTADO DIRECTO AL BACKEND
  const handleDeleteUser = async (id: number, name: string) => {
    if (window.confirm(`¿Estás completamente seguro de que deseas eliminar a ${name}?`)) {
      try {
        await deleteUserFromAdmin(id); // Ejecuta el DELETE en Spring Boot
        setUsers(users.filter(user => user.id !== id)); // Limpia el estado de la UI
        toast.success("Usuario eliminado de la base de datos.");
      } catch (error) {
        console.error(error);
        toast.error("Error al intentar eliminar el usuario en el servidor.");
      }
    }
  };

  // 🌟 GUARDAR / MODIFICAR CONECTADO DIRECTO AL BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || (!isEditing && !password)) {
      toast.error("Por favor, completa los campos requeridos.");
      return;
    }

    const payload: UserSystem = {
      fullName,
      email,
      role,
      ...(password && { password }) 
    };

    try {
      if (isEditing && selectedUserId) {
        // Petición PUT activa hacia /api/admin/users/{id}
        const updatedUser = await updateUserFromAdmin(selectedUserId, payload);
        setUsers(users.map(u => u.id === selectedUserId ? updatedUser : u));
        toast.success("Usuario actualizado correctamente.");
      } else {
        // Petición POST activa hacia /api/admin/users
        const createdUser = await createUserFromAdmin(payload);
        setUsers([createdUser, ...users]);
        toast.success(`Usuario con rol de ${role} guardado con éxito.`);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar la solicitud en el servidor.");
    }
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { text: "Administrador", color: "#60a5fa", bg: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", icon: <ShieldCheck size={12} /> };
      case "EMPLOYEE":
        return { text: "Empleado / Socio", color: "#c084fc", bg: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.2)", icon: <UserCog size={12} /> };
      default:
        return { text: "Cliente Final", color: "#a1a1aa", bg: "rgba(161, 161, 170, 0.1)", border: "1px solid rgba(161, 161, 170, 0.15)", icon: <User size={12} /> };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%", boxSizing: "border-box" }}>
      
      {/* ENCABEZADO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Users size={24} style={{ color: "#2563eb" }} />
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
              Control de Usuarios
            </h1>
          </div>
          <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0 }}>
            Administra los roles globales del ecosistema, da de alta personal de soporte de la plataforma y supervisa clientes.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "10px",
            backgroundColor: "#2563eb", color: "#ffffff", border: "none", fontSize: "14px", fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
          }}
        >
          <Plus size={18} />
          <span>Registrar Personal</span>
        </button>
      </div>

      {/* BARRA DE FILTRADO */}
      <div style={{ backgroundColor: "rgba(23, 23, 23, 0.4)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "12px", padding: "16px" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", color: "#71717a" }} />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre completo, correo electrónico o rol asignado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "8px", padding: "12px 12px 12px 42px", color: "#ffffff", fontSize: "14px", outline: "none"
            }}
          />
        </div>
      </div>

      {/* TABLA DE CONTROL */}
      <div style={{ backgroundColor: "rgba(23, 23, 23, 0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#141414", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600 }}>ID</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600 }}>Nombre Completo</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600 }}>Identificador Digital (Email)</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600, textAlign: "center" }}>Rol de Acceso</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600, textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const roleConfig = getRoleConfig(user.role);
                  return (
                    <tr
                      key={user.id}
                      onMouseEnter={() => setFocusedRow(user.id || null)}
                      onMouseLeave={() => setFocusedRow(null)}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                        backgroundColor: focusedRow === user.id ? "rgba(255, 255, 255, 0.015)" : "transparent",
                        transition: "background-color 0.15s ease"
                      }}
                    >
                      <td style={{ padding: "16px 20px", color: "#71717a", fontFamily: "monospace" }}>#{user.id}</td>
                      <td style={{ padding: "16px 20px", color: "#ffffff", fontWeight: 600 }}>{user.fullName}</td>
                      <td style={{ padding: "16px 20px", color: "#e4e4e7" }}>{user.email}</td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700,
                          backgroundColor: roleConfig.bg, color: roleConfig.color, border: roleConfig.border,
                          display: "inline-flex", alignItems: "center", gap: "6px"
                        }}>
                          {roleConfig.icon}
                          {roleConfig.text}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            onMouseEnter={() => setHoveredAction(`edit-${user.id}`)}
                            onMouseLeave={() => setHoveredAction(null)}
                            title="Editar usuario"
                            style={{
                              border: "none", background: "none", cursor: "pointer", padding: "6px", borderRadius: "6px",
                              color: hoveredAction === `edit-${user.id}` ? "#3b82f6" : "#a1a1aa",
                              backgroundColor: hoveredAction === `edit-${user.id}` ? "rgba(59, 130, 246, 0.1)" : "transparent",
                              transition: "all 0.2s"
                            }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id!, user.fullName)}
                            onMouseEnter={() => setHoveredAction(`del-${user.id}`)}
                            onMouseLeave={() => setHoveredAction(null)}
                            title="Eliminar usuario"
                            style={{
                              border: "none", background: "none", cursor: "pointer", padding: "6px", borderRadius: "6px",
                              color: hoveredAction === `del-${user.id}` ? "#ef4444" : "#a1a1aa",
                              backgroundColor: hoveredAction === `del-${user.id}` ? "rgba(239, 68, 68, 0.1)" : "transparent",
                              transition: "all 0.2s"
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#71717a" }}>
                    No se encontraron usuarios que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FLOTANTE */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#0c0c0e", border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px", padding: "28px", width: "420px", display: "flex", flexDirection: "column", gap: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={20} style={{ color: "#2563eb" }} />
                <h3 style={{ margin: 0, color: "#ffffff", fontSize: "18px", fontWeight: 700 }}>
                  {isEditing ? "Modificar Credenciales" : "Nuevo Miembro del Equipo"}
                </h3>
              </div>
              <X size={18} style={{ color: "#a1a1aa", cursor: "pointer" }} onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#a1a1aa", fontWeight: 500 }} htmlFor="fullName">Nombre Completo</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <User size={14} style={{ position: "absolute", left: "12px", color: "#71717a" }} />
                  <input type="text" id="fullName" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                    style={{ width: "100%", backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 12px 10px 34px", color: "#fff", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#a1a1aa", fontWeight: 500 }} htmlFor="email">Correo Electrónico</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Mail size={14} style={{ position: "absolute", left: "12px", color: "#71717a" }} />
                  <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    style={{ width: "100%", backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 12px 10px 34px", color: "#fff", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#a1a1aa", fontWeight: 500 }} htmlFor="password">
                  {isEditing ? "Nueva Contraseña (Opcional)" : "Contraseña Provisional"}
                </label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEditing}
                  style={{ width: "100%", backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#a1a1aa", fontWeight: 500 }} htmlFor="role">Rol Asignado</label>
                <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value as any)}
                  style={{ width: "100%", backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "14px", cursor: "pointer" }}
                >
                  <option value="EMPLOYEE">Empleado / Socio Comercial</option>
                  <option value="ADMIN">Administrador General</option>
                  <option value="CLIENT">Cliente (Registro Manual)</option>
                </select>
              </div>

              <button type="submit"
                style={{
                  marginTop: "8px", width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#2563eb",
                  color: "#fff", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer"
                }}
              >
                {isEditing ? "Guardar Cambios" : "Confirmar y Guardar"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}