import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Interfaz para definir el modelo de datos de un Recurso (Court, Table, etc.)
export interface Resource {
  id: number;
  name: string;
  type: "COURT" | "TABLE" | "ROOM"; // Tipado estricto según los Enums de Spring Boot
  capacity: number;
  pricePerHour: number;
  available: boolean;
  businessId: number;
}

export const useResources = (businessId?: number) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener recursos (ya sea globales o filtrados por negocio)
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      // Si pasas un businessId, apuntamos al endpoint específico del negocio
      const url = businessId 
        ? `http://localhost:8080/api/businesses/${businessId}/resources`
        : "http://localhost:8080/api/resources";

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}` // Descomentar si usas JWT
        }
      });

      if (!response.ok) throw new Error("Error al obtener los recursos");

      const data = await response.json();
      setResources(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("No se pudieron cargar los recursos");
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar dinámicamente la disponibilidad de un recurso (ej. mantenimiento)
  const toggleResourceAvailability = async (id: number, currentAvailability: boolean) => {
    try {
      const response = await fetch(`http://localhost:8080/api/resources/${id}/availability`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ available: !currentAvailability }),
      });

      if (!response.ok) throw new Error("No se pudo actualizar la disponibilidad");

      toast.success("Disponibilidad del recurso actualizada");
      
      // Mutación rápida del estado local para no golpear la API innecesariamente
      setResources((prev) =>
        prev.map((res) => (res.id === id ? { ...res, available: !currentAvailability } : res))
      );
    } catch (err: any) {
      toast.error("Error al modificar el estado del recurso");
      console.error("Resource availability patch error:", err);
    }
  };

  // Carga automática al montar el hook o si el id del negocio cambia
  useEffect(() => {
    fetchResources();
  }, [businessId]);

  return {
    resources,
    loading,
    error,
    toggleResourceAvailability,
    refresh: fetchResources
  };
};