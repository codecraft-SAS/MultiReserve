import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { getBusinessById, updateBusiness } from "../../services/businessService";
import toast from "react-hot-toast";

export default function EditBusinessForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 🔄 Sincronizado con todos los campos de creación y el ownerId oculto
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    imageUrl: "",
    active: true,
    ownerId: null as number | null // ◄ Campo necesario para satisfacer el @NotNull de Java
  });

  useEffect(() => {
    const loadBusinessData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const business = await getBusinessById(Number(id));
        setFormData({
          name: business.name || "",
          category: business.category || "",
          description: business.description || "",
          city: business.city || "",
          address: business.address || "",
          phone: business.phone || "",
          email: business.email || "",
          imageUrl: business.imageUrl || "",
          active: business.active !== undefined ? business.active : true,
          // 🛠️ Mapea el ID del dueño (soporta si viene plano o como objeto anidado)
          ownerId: (business as any).ownerId || ((business as any).owner ? (business as any).owner.id : null)
        });
      } catch (error) {
        console.error("Error al cargar el negocio:", error);
        toast.error("No se pudieron cargar los datos del establecimiento");
        navigate("/admin/businesses");
      } finally {
        setLoading(false);
      }
    };

    loadBusinessData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSaving(true);
      await updateBusiness(Number(id), formData);
      toast.success("Establecimiento actualizado con éxito");
      navigate("/admin/businesses");
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Hubo un error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center", padding: "100px 20px" }}>
        <Loader2 size={36} className="animate-spin" style={{ color: "#2563eb" }} />
        <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>Cargando información comercial...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", maxWidth: "600px", margin: "0 auto", boxSizing: "border-box", color: "#ffffff" }}>
      
      {/* Encabezado */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button 
          onClick={() => navigate("/admin/businesses")}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "none", borderRadius: "10px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", cursor: "pointer" }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>Editar Establecimiento</h1>
          <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>Modifica los parámetros operativos de tu negocio.</p>
        </div>
      </div>

      {/* Formulario Completo */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: "rgba(23, 23, 23, 0.6)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }} autoComplete="off">
        
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#52525b", letterSpacing: "0.05em" }}>INFORMACIÓN BASE</span>

        {/* Nombre y Categoría en paralelo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Nombre del Negocio</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name} 
              onChange={handleChange}
              style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }} 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Categoría</label>
            <select 
              name="category"
              required
              value={formData.category} 
              onChange={handleChange}
              style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none", colorScheme: "dark", width: "100%", boxSizing: "border-box" }}
            >
              <option value="RESTAURANT">🍔 Restaurante</option>
              <option value="DEPORTE">⚽ Canchas Sintéticas / Deporte</option>
              <option value="HOTEL">🏨 Hotel / Alojamiento</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Descripción</label>
          <textarea 
            name="description"
            rows={3}
            value={formData.description} 
            onChange={handleChange}
            placeholder="Describe detalladamente los servicios..."
            style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none", resize: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }} 
          />
        </div>

        <span style={{ fontSize: "11px", fontWeight: 700, color: "#52525b", letterSpacing: "0.05em", marginTop: "10px" }}>📍 UBICACIÓN</span>

        {/* Ciudad y Dirección */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Ciudad</label>
            <input 
              type="text" 
              name="city"
              required
              value={formData.city} 
              onChange={handleChange}
              style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }} 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Dirección</label>
            <input 
              type="text" 
              name="address"
              required
              value={formData.address} 
              onChange={handleChange}
              style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }} 
            />
          </div>
        </div>

        <span style={{ fontSize: "11px", fontWeight: 700, color: "#52525b", letterSpacing: "0.05em", marginTop: "10px" }}>📞 CONTACTO</span>

        {/* Teléfono y Correo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Teléfono</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone} 
              onChange={handleChange}
              style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }} 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Email de Contacto</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange}
              style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }} 
            />
          </div>
        </div>

        <span style={{ fontSize: "11px", fontWeight: 700, color: "#52525b", letterSpacing: "0.05em", marginTop: "10px" }}>🖼️ MULTIMEDIA E IDENTIDAD</span>

        {/* URL de la Imagen */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>URL Imagen de Portada</label>
          <input 
            type="text" 
            name="imageUrl"
            value={formData.imageUrl} 
            onChange={handleChange}
            style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" }} 
          />
        </div>

        {/* Checkbox de Habilitado/Activo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <input 
            type="checkbox" 
            name="active"
            id="active"
            checked={formData.active} 
            onChange={handleChange}
            style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#2563eb" }} 
          />
          <label htmlFor="active" style={{ fontSize: "14px", color: "#fff", cursor: "pointer", userSelect: "none" }}>
            Negocio habilitado y activo para el público
          </label>
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={saving}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "14px",
            borderRadius: "10px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            fontSize: "14px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            marginTop: "15px",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Guardando cambios...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Guardar Configuración</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}