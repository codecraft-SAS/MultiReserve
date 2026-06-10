import { useState, useEffect } from "react";
import type { Business } from "../types/Business";
import toast from "react-hot-toast";
import { businessesApi } from "../api/businesses";

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Cargar negocios
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessesApi.list();
      setBusinesses(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener negocios");
      toast.error("No se pudieron cargar los negocios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // ✅ Activar/Desactivar negocio
  const toggleBusinessStatus = async (id: number, currentStatus: boolean) => {
    try {
      await businessesApi.toggleStatus(id);
      toast.success(
        currentStatus ? "Negocio desactivado con éxito" : "Negocio activado con éxito"
      );
      fetchBusinesses();
    } catch (err: any) {
      setError(err.message || "Error al actualizar el estado");
      toast.error("Error al actualizar el estado");
    }
  };

  // 🗑️ Eliminar negocio
  const deleteBusiness = async (id: number) => {
    try {
      await businessesApi.remove(id);
      toast.success("Negocio eliminado con éxito");
      fetchBusinesses();
    } catch (err: any) {
      setError(err.message || "Error al eliminar negocio");
      toast.error("Error al eliminar negocio");
    }
  };

  return {
    businesses,
    loading,
    error,
    toggleBusinessStatus,
    deleteBusiness, // 👈 ahora disponible en el hook
    refresh: fetchBusinesses,
  };
};
