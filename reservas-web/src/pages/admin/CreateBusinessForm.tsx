import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { http } from "../../api/http";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Building2, Image as ImageIcon } from "lucide-react";

type Category = "RESTAURANT" | "SPORT" | "HOTEL" | "EVENT" | "COWORKING";

interface CreateBusinessFormData {
  name: string;
  description: string;
  category: Category;
  city: string;
  address: string;
  phone: string;
  email: string;
  imageUrl: string;
  active: boolean;
}

export default function CreateBusinessForm({ onNavigate }: { onNavigate: () => void }) {
  useAuth();

  const [formData, setFormData] = useState<CreateBusinessFormData>({
    name: "",
    description: "",
    category: "RESTAURANT",
    city: "",
    address: "",
    phone: "",
    email: "",
    imageUrl: "",
    active: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        city: formData.city.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        imageUrl: formData.imageUrl.trim(),
        active: formData.active,
      };

      await http("/businesses", { method: "POST", body: JSON.stringify(payload) });

      toast.success("¡Negocio creado exitosamente!");
      onNavigate();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Hubo un problema al guardar el negocio";
      toast.error(errorMsg);
      console.error("Error creating business:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#ffffff" }}>
      {/* Botón Volver */}
      <button 
        onClick={() => onNavigate()} 
        style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "transparent", border: "none", color: "#a1a1aa", cursor: "pointer", marginBottom: "20px", fontSize: "14px" }}
      >
        <ArrowLeft size={16} /> Volver a la gestión de negocios
      </button>

      {/* Cabecera de la vista */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <Building2 size={24} style={{ color: "#2563eb" }} />
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>Registrar Nuevo Negocio</h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", backgroundColor: "rgba(23, 23, 23, 0.6)", padding: "28px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
        
        {/* SECCIÓN 1: INFORMACIÓN DEL NEGOCIO */}
        <h4 style={{ textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em", color: "#52525b", margin: "0 0 -8px 0", fontWeight: 700 }}>
          🏢 Información Base
        </h4>

        {/* Nombre */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Nombre del Negocio</label>
          <input 
            type="text" 
            required 
            placeholder="Ej. Central Park Arena" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", boxSizing: "border-box" }} 
          />
        </div>

        {/* Categoría */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Categoría</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })} 
            style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", cursor: "pointer", boxSizing: "border-box" }}
          >
            <option value="RESTAURANT">🍽️ Restaurante</option>
            <option value="SPORT">⚽ Centro Deportivo</option>
            <option value="HOTEL">🏨 Hotel</option>
            <option value="EVENT">🎉 Eventos</option>
            <option value="COWORKING">💻 Coworking</option>
          </select>
        </div>

        {/* Descripción */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Descripción</label>
          <textarea 
            rows={3} 
            placeholder="Describe detalladamente los servicios o enfoque del negocio..." 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", resize: "none", boxSizing: "border-box" }} 
          />
        </div>

        {/* SECCIÓN 2: UBICACIÓN */}
        <h4 style={{ textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em", color: "#52525b", margin: "10px 0 -8px 0", fontWeight: 700 }}>
          📍 Ubicación
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Ciudad</label>
            <input 
              type="text" 
              required 
              placeholder="Ej. Pasto" 
              value={formData.city} 
              onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
              style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", boxSizing: "border-box" }} 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Dirección</label>
            <input 
              type="text" 
              required 
              placeholder="Ej. Calle 18 #24-02" 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
              style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", boxSizing: "border-box" }} 
            />
          </div>
        </div>

        {/* SECCIÓN 3: CONTACTO */}
        <h4 style={{ textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em", color: "#52525b", margin: "10px 0 -8px 0", fontWeight: 700 }}>
          📞 Contacto
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Teléfono</label>
            <input 
              type="tel" 
              placeholder="Ej. 3157000000" 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
              style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", boxSizing: "border-box" }} 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Email de Contacto</label>
            <input 
              type="email" 
              placeholder="contacto@negocio.com" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", boxSizing: "border-box" }} 
            />
          </div>
        </div>

        {/* SECCIÓN 4: IMAGEN Y ESTADO */}
        <h4 style={{ textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em", color: "#52525b", margin: "10px 0 -8px 0", fontWeight: 700 }}>
          🖼️ Multimedia e Identidad
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>URL de Imagen de Portada</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <ImageIcon size={18} style={{ position: "absolute", left: "12px", color: "#666" }} />
            <input 
              type="url" 
              placeholder="https://images.unsplash.com/..." 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
              style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px 12px 12px 40px", color: "#ffffff", outline: "none", boxSizing: "border-box" }} 
            />
          </div>
        </div>

        {/* CORRECCIÓN LÍNEA 229: h -> height */}
        {formData.imageUrl && (
          <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <img 
              src={formData.imageUrl} 
              alt="preview" 
              style={{ width: "100%", height: "auto", maxHeight: "200px", objectFit: "cover", display: "block" }} 
            />
          </div>
        )}

        {/* Vista Previa de la tarjeta */}
        {formData.name && (
          <div style={{ backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "16px" }}>
            <p style={{ fontSize: "11px", color: "#52525b", margin: "0 0 10px 0", textTransform: "uppercase", fontWeight: 700 }}>Vista previa</p>
            <div style={{ display: "flex", gap: "16px", alignItems: "start" }}>
              {/* CORRECCIÓN LÍNEA 239: justifyValue -> justifyContent */}
              <div style={{ width: "112px", height: "80px", backgroundColor: "#1c1c1e", borderRadius: "6px", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ fontSize: "11px", color: "#52525b", fontWeight: 600 }}>SIN PORTADA</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{formData.name}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "14px", margin: "4px 0 0 0" }}>
                  {formData.category === "RESTAURANT" ? "🍽️ Restaurante" : formData.category === "SPORT" ? "⚽ Centro Deportivo" : formData.category === "HOTEL" ? "🏨 Hotel" : formData.category === "EVENT" ? "🎉 Eventos" : "💻 Coworking"}
                </p>
                <p style={{ color: "#71717a", fontSize: "13px", margin: "4px 0 0 0" }}>{formData.city || "Ciudad no especificada"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Checkbox */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
          <input 
            type="checkbox" 
            id="active-checkbox"
            checked={formData.active} 
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })} 
            style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#2563eb" }} 
          />
          <label htmlFor="active-checkbox" style={{ fontSize: "14px", color: "#a1a1aa", cursor: "pointer", userSelect: "none" }}>
            Negocio habilitado y activo para el público
          </label>
        </div>

        {/* Botonera de Acción */}
        <div style={{ display: "flex", justifyContent: "end", gap: "12px", marginTop: "10px", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <button 
            type="button" 
            disabled={submitting} 
            onClick={() => onNavigate()} 
            style={{ padding: "12px 20px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "transparent", color: "#a1a1aa", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
          >
            Cancelar
          </button>
          
          <button 
            type="submit" 
            disabled={submitting} 
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "#ffffff", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}
          >
            <Save size={16} />
            {submitting ? "Guardando..." : "Publicar Establecimiento"}
          </button>
        </div>

      </form>
    </div>
  );
}