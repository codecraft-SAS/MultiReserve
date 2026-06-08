import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import type { Business } from "../types/Business";
import { getActiveBusinesses, searchBusinesses } from "../services/businessService";

export default function BusinessCatalog() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const data = await getActiveBusinesses();
      setBusinesses(data);
    } catch (error) {
      console.error("Error al cargar negocios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = search.trim() ? await searchBusinesses(search) : await getActiveBusinesses();
      setBusinesses(data);
    } catch (error) {
      console.error("Error al buscar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-8">
        Catálogo de Negocios
      </h1>

      {/* Barra de búsqueda */}
      <div className="flex gap-3 mb-8 max-w-3xl">
        <input
          type="text"
          placeholder="Buscar negocio por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#27272a] rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#09090b] text-white transition-all"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg flex items-center gap-2 font-semibold transition-all"
        >
          <Search size={18} />
          Buscar
        </button>
      </div>

      {/* Estado de carga */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-blue-500">
          <Loader2 size={48} className="animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all shadow-lg"
            >
              <img
                src={business.imageUrl || "https://placehold.co/600x400"}
                alt={business.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5 space-y-3">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                  {business.category}
                </span>

                <h2 className="text-xl font-bold text-white">{business.name}</h2>
                <p className="text-zinc-400 text-sm line-clamp-2">{business.description}</p>

                <div className="pt-4 border-t border-[#27272a] grid grid-cols-2 gap-3 text-xs text-zinc-400">
                  <p>⭐ <span className="text-white font-bold">{business.rating ?? 0}</span> Rating</p>
                  <p>📍 <span className="text-white font-bold">{business.city}</span></p>
                  <p className="col-span-2">🏟 Disponible: <span className="text-white font-bold">{business.totalResources}</span> recursos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}