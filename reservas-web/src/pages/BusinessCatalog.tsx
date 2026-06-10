import { useEffect, useState, useMemo } from "react";
import { Loader2, MapPin, Calendar, X, Info, Store, Layers, Phone } from "lucide-react";
import type { Business } from "../types/Business";
import type { Resource } from "../types/Resource";
import { businessesApi } from "../api/businesses";
import { resourcesApi } from "../api/resources";
import { useReservations } from "../hooks/useReservations";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function BusinessCatalog() {
  // ==========================================
  // 1. ESTADOS DEL COMPONENTE
  // ==========================================
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados para el Flujo de Reserva Integrado
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Estados del Formulario de Reserva
  const [reserveDate, setReserveDate] = useState("");
  const [occupiedHours, setOccupiedHours] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amountPaid, setAmountPaid] = useState<number>(0);

  // Estado para el Método de Pago Seleccionado
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"nequi" | "bancolombia" | "daviplata">("nequi");

  // Estado para controlar el Súper Aviso de Éxito
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Estado para el Modal de Info
  const [infoBusiness, setInfoBusiness] = useState<Business | null>(null);

  // Hooks personalizados
  const { createNewReservation } = useReservations();
  const { user } = useAuth();

  // ==========================================
  // 2. FORMATEADORES Y DERIVADOS
  // ==========================================
  const safeBusinesses = useMemo(() => {
    if (!businesses) return [];
    if (Array.isArray(businesses)) return businesses;
    if (typeof businesses === 'object' && 'data' in businesses) return (businesses as any).data;
    return [];
  }, [businesses]);

  // CALCULO DIRECTO CON PREVENCIÓN SEGURA CONTRA VALORES INDEFINIDOS
  const pricePerHourDisplay = useMemo(() => {
    if (!selectedResource) return 0;
    return selectedResource.pricePerHour ?? (selectedResource as any).price_per_hour ?? (selectedResource as any).price ?? 0;
  }, [selectedResource]);

  const totalAmount = useMemo(() => {
    if (!selectedResource || !startTime || !endTime) return 0;

    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);

    const hoursCount = endHour - startHour;
    return hoursCount > 0 ? pricePerHourDisplay * hoursCount : 0;
  }, [selectedResource, startTime, endTime, pricePerHourDisplay]);

  const formatCategory = (cat: string) => {
    if (!cat) return "🏢 Negocio";
    const upper = cat.toUpperCase();
    if (upper.includes("REST")) return "🌐 Resto";
    if (upper.includes("SPOR") || upper.includes("CAN")) return "🌐 Deporte";
    if (upper.includes("HOT")) return "🌐 Hotel";
    return `🌐 ${cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}`;
  };

  // ==========================================
  // 3. CONTROLADORES DE CAMBIO DE ESTADO
  // ==========================================

  const handleSelectResource = (resource: Resource) => {
    const normalizedPrice = resource.pricePerHour ?? (resource as any).price_per_hour ?? (resource as any).price ?? 0;
    setSelectedResource({
      ...resource,
      pricePerHour: Number(normalizedPrice)
    });
    setReserveDate("");
    setStartTime("");
    setEndTime("");
    setAmountPaid(0);
    setOccupiedHours([]);
  };

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessesApi.getActive();
      setBusinesses(data);
    } catch (error) {
      console.error("Error al cargar negocios:", error);
      toast.error("Error al conectar con el servidor empresarial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = search.trim() ? await businessesApi.search(search) : await businessesApi.getActive();
      setBusinesses(data);
    } catch (error) {
      console.error("Error al buscar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBusiness = async (business: Business) => {
    setSelectedBusiness(business);
    setLoadingResources(true);
    setSelectedResource(null);
    setReserveDate("");
    setStartTime("");
    setEndTime("");
    setAmountPaid(0);
    setOccupiedHours([]);
    try {
      const data = await resourcesApi.getByBusiness(business.id);
      setResources(data);
    } catch (error) {
      console.error("Error al cargar recursos:", error);
      toast.error("No se pudieron cargar los escenarios disponibles.");
    } finally {
      setLoadingResources(false);
    }
  };

  const handleDateChange = async (date: string) => {
    setReserveDate(date);
    setStartTime("");
    setEndTime("");
    setAmountPaid(0);
    if (!selectedResource || !date) return;

    try {
      const busyTimes = await resourcesApi.getAvailability(selectedResource.id, date);
      setOccupiedHours(busyTimes);
    } catch (error) {
      console.error("Error al chequear disponibilidad:", error);
    }
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource || !reserveDate || !startTime || !endTime) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    const clientName = user?.fullName || user?.email || "Cliente Registrado";
    const resourceTypeVal = selectedResource.type || selectedBusiness?.category || "DEPORTIVO";

    const formattedStart = `${startTime}:00`;
    const formattedEnd = `${endTime}:00`;

    const finalPaymentMethod = selectedPaymentMethod === "nequi" 
      ? "NEQUI - 3147455770" 
      : selectedPaymentMethod === "bancolombia" 
        ? "BANCOLOMBIA - Ahorros 551-000234-91" 
        : "DAVIPLATA - 3147455770";

    const result = await createNewReservation({
      resourceId: selectedResource.id,
      resourceName: selectedResource.name,
      resourceType: resourceTypeVal.toUpperCase().trim(),
      customerName: clientName,
      reservationDate: reserveDate,
      startTime: formattedStart,
      endTime: formattedEnd,
      purpose: purpose.trim() || "Reserva de cliente",
      businessId: selectedBusiness?.id,
      amountPaid: amountPaid,
      paymentMethod: finalPaymentMethod
    });

    if (result.success) {
      // 1. Apagamos el modal principal del formulario limpiando el negocio seleccionado
      setSelectedBusiness(null);
      setSelectedResource(null);
      setReserveDate("");
      setStartTime("");
      setEndTime("");
      setPurpose("");
      setAmountPaid(0);

      // 2. Encendemos el súper aviso centralizado de éxito
      setShowSuccessAlert(true);

      // 3. Programamos el temporizador cambiado a 40 segundos (40000 milisegundos)
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 40000);
    }
  };

  const availableTimeSlots = useMemo(() => {
    const open = selectedResource?.openingHour;
    const close = selectedResource?.closingHour;
    if (!open || !close || open === "00:00" || close === "00:00") return [];
    const openHour = parseInt(open.split(":")[0], 10);
    const closeHour = parseInt(close.split(":")[0], 10);
    const slots: string[] = [];
    for (let h = openHour; h <= closeHour; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
    }
    return slots;
  }, [selectedResource]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
        <Loader2 size={36} className="animate-spin" style={{ color: "#2563eb" }} />
        <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>Consultando base de datos de MultiReserve...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", boxSizing: "border-box", color: "#ffffff", fontFamily: "system-ui, sans-serif" }}>

      {/* ─── ENCABEZADO ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Store size={24} style={{ color: "#2563eb" }} />
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
            Catálogo de Negocios
          </h1>
        </div>
        <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0 }}>
          Explora los establecimientos comerciales disponibles y solicita tus reservas en tiempo real.
        </p>
      </div>

      {/* ─── BARRA DE BÚSQUEDA ─── */}
      <form onSubmit={handleSearchSubmit} style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", gap: "12px" }}>
        <span style={{ position: "absolute", left: "16px", fontSize: "14px" }}>🔍</span>
        <input
          type="text"
          placeholder="Escribe el nombre o categoría y presiona Enter para buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "rgba(23, 23, 23, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            padding: "14px 14px 14px 48px",
            color: "#ffffff",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </form>

      {/* ─── GRILLA DE NEGOCIOS ─── */}
      {safeBusinesses.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}>
          {safeBusinesses.map((biz: any) => (
            <div
              key={biz.id}
              style={{
                backgroundColor: "#18181b",
                borderRadius: "16px",
                border: "1px solid #27272a",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ width: "100%", height: "180px", position: "relative", backgroundColor: "#111111" }}>
                {biz.imageUrl ? (
                  <img src={biz.imageUrl} alt={biz.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#52525b", fontSize: "12px", fontWeight: 600 }}>
                    SIN IMAGEN DE PORTADA
                  </div>
                )}
                <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                  <span style={{ fontSize: "10px", color: "#ffffff", backgroundColor: "rgba(9, 9, 11, 0.75)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: "6px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.08)" }}>
                    {formatCategory(biz.category)}
                  </span>
                </div>
                <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
                    Disponible
                  </span>
                </div>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>{biz.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#a1a1aa", fontSize: "13px" }}>
                    <MapPin size={14} style={{ color: "#71717a" }} />
                    <span>{biz.city || "Pasto"} • <span style={{ color: "#71717a" }}>{biz.address || "Dirección"}</span></span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid #27272a", paddingTop: "12px", marginTop: "4px" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#71717a", display: "block", marginBottom: "2px" }}>Módulos Habilitados</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>
                      <Layers size={14} style={{ color: "#3b82f6" }} />
                      <span>{biz.totalResources || 0} Escenarios</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setInfoBusiness(biz)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", backgroundColor: "#27272a", border: "none", borderRadius: "8px", color: "#ffffff", padding: "10px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer", flex: 1 }}
                  >
                    <Info size={14} />
                    <span>Info</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectBusiness(biz)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", backgroundColor: "#2563eb", border: "none", borderRadius: "8px", color: "#ffffff", padding: "10px 14px", fontSize: "13px", fontWeight: 700, cursor: "pointer", flex: 2, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)" }}
                  >
                    <Calendar size={14} />
                    <span>Reservar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#71717a", border: "1px dashed #27272a", borderRadius: "16px" }}>
          No se encontraron establecimientos activos que coincidan con la búsqueda.
        </div>
      )}

      {/* ─── MODAL DETALLES Y AGENDAMIENTO INTEGRADO ─── */}
      {selectedBusiness && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
          <div style={{ backgroundColor: "#131314", padding: "28px", borderRadius: "16px", border: "1px solid #27272a", width: "100%", maxWidth: "840px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>

            <button
              type="button"
              onClick={() => setSelectedBusiness(null)}
              style={{ position: "absolute", top: "20px", right: "20px", backgroundColor: "transparent", border: "none", color: "#a1a1aa", cursor: "pointer" }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "20px" }}>
              <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: 700, textTransform: "uppercase" }}>{formatCategory(selectedBusiness.category || "")}</span>
              <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>{selectedBusiness.name}</h2>
              <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0 }}>{selectedBusiness.description}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

              {/* Bloque Izquierdo: Escenarios */}
              <div>
                <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "#71717a", fontWeight: 700, marginBottom: "12px" }}>1. Elige el área o recurso</h4>
                {loadingResources ? (
                  <div style={{ display: "flex", padding: "20px", justifyContent: "center" }}><Loader2 className="animate-spin text-blue-500" /></div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "280px", overflowY: "auto" }}>
                    {resources.map((res) => {
                      const activeRes = selectedResource?.id === res.id;
                      const rawPrice = res.pricePerHour ?? (res as any).price_per_hour ?? (res as any).price ?? 0;
                      return (
                        <div
                          key={res.id}
                          onClick={() => handleSelectResource(res)}
                          style={{
                            padding: "14px",
                            borderRadius: "10px",
                            backgroundColor: activeRes ? "rgba(37, 99, 235, 0.08)" : "#18181b",
                            border: activeRes ? "1px solid #2563eb" : "1px solid #27272a",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <h5 style={{ margin: 0, fontWeight: 700, fontSize: "14px" }}>{res.name}</h5>
                              <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#a1a1aa" }}>{res.description || "Sin descripción"}</p>
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#2563eb" }}>
                              ${Number(rawPrice).toLocaleString("es-CO")} /hora
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bloque Derecho: Formulario de Turno */}
              <form onSubmit={handleSubmitReservation} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "#71717a", fontWeight: 700, marginBottom: "0" }}>2. Fecha y horario</h4>

                <input
                  type="date"
                  disabled={!selectedResource}
                  min={new Date().toISOString().split("T")[0]}
                  value={reserveDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#111111", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", colorScheme: "dark" }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <select
                    disabled={!reserveDate}
                    value={startTime}
                    onChange={(e) => { setStartTime(e.target.value); setEndTime(""); setAmountPaid(0); }}
                    style={{ width: "100%", backgroundColor: "#111111", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", colorScheme: "dark" }}
                  >
                    <option value="">Inicio</option>
                    {availableTimeSlots.filter((_, idx, arr) => idx < arr.length - 1).map((slot) => {
                      const busy = occupiedHours.includes(slot);
                      return <option key={slot} value={slot} disabled={busy}>{slot} {busy ? "🔒 (Ocupado)" : ""}</option>;
                    })}
                  </select>

                  <select
                    disabled={!startTime}
                    value={endTime}
                    onChange={(e) => { setEndTime(e.target.value); setAmountPaid(0); }}
                    style={{ width: "100%", backgroundColor: "#111111", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", colorScheme: "dark" }}
                  >
                    <option value="">Fin</option>
                    {availableTimeSlots.filter((slot) => slot > startTime).map((slot) => {
                      const busy = occupiedHours.includes(slot);
                      return <option key={slot} value={slot} disabled={busy}>{slot} {busy ? "🔒 (Ocupado)" : ""}</option>;
                    })}
                  </select>
                </div>

                {/* TABLA DE DESGLOSE DE PRECIOS */}
                <div style={{ backgroundColor: "#111111", padding: "12px", borderRadius: "8px", border: "1px solid #27272a", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#a1a1aa" }}>Precio por hora:</span>
                    <span style={{ fontWeight: 700, color: "#ffffff" }}>
                      ${pricePerHourDisplay.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid #27272a", paddingTop: "6px", marginTop: "6px" }}>
                    <span style={{ color: "#a1a1aa" }}>Valor calculado:</span>
                    <span style={{ color: "#2563eb" }}>
                      ${totalAmount.toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "4px", color: "#a1a1aa" }}>
                    <span>Total Pendiente:</span>
                    <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                      ${totalAmount > 0 ? Math.max(0, totalAmount - amountPaid).toLocaleString("es-CO") : 0}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ fontSize: "11px", color: "#71717a" }}>¿Cuánto vas a abonar?</label>
                      <span style={{ fontSize: "10px", color: "#f59e0b", fontWeight: "600" }}>(Mínimo: $25.000)</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      placeholder="Ej. 25000"
                      value={amountPaid || ""}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      style={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "8px", color: "#ffffff", outline: "none", width: "100%" }}
                    />
                  </div>

                  {/* 🚨 ALERTAS DE VALIDACIÓN DE DINERO */}
                  {amountPaid > totalAmount && (
                    <p style={{ fontSize: "11px", color: "#ef4444", fontWeight: "bold", textAlign: "center", margin: "8px 0 0 0", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "6px", borderRadius: "4px" }}>
                      ⚠️ El abono excede el total de la reserva
                    </p>
                  )}

                  {totalAmount > 0 && amountPaid < Math.min(25000, totalAmount) && (
                    <p style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "bold", textAlign: "center", margin: "8px 0 0 0", backgroundColor: "rgba(245, 158, 11, 0.1)", padding: "6px", borderRadius: "4px" }}>
                      ⚠️ El abono mínimo requerido para reservar es de $25.000
                    </p>
                  )}
                </div>

                {/* SECCIÓN MÉTODOS DE PAGO */}
                <div style={{ marginTop: "12px" }}>
                  <label style={{ fontSize: "11px", color: "#a1a1aa", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                    Elige el Método de pago para el abono:
                  </label>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {/* CASILLA NEQUI */}
                    <div 
                      onClick={() => setSelectedPaymentMethod("nequi")}
                      style={{
                        backgroundColor: selectedPaymentMethod === "nequi" ? "rgba(224, 0, 118, 0.15)" : "#18181b",
                        border: selectedPaymentMethod === "nequi" ? "1px solid #e00076" : "1px solid #27272a",
                        borderRadius: "8px", padding: "10px 4px", textAlign: "center", cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: selectedPaymentMethod === "nequi" ? "#e00076" : "#ffffff", display: "block" }}>
                        🔮 Nequi
                      </span>
                    </div>

                    {/* CASILLA BANCOLOMBIA */}
                    <div 
                      onClick={() => setSelectedPaymentMethod("bancolombia")}
                      style={{
                        backgroundColor: selectedPaymentMethod === "bancolombia" ? "rgba(253, 197, 0, 0.15)" : "#18181b",
                        border: selectedPaymentMethod === "bancolombia" ? "1px solid #fdc500" : "1px solid #27272a",
                        borderRadius: "8px", padding: "10px 4px", textAlign: "center", cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: selectedPaymentMethod === "bancolombia" ? "#fdc500" : "#ffffff", display: "block" }}>
                        🖤 Bancolombia
                      </span>
                    </div>

                    {/* CASILLA DAVIPLATA */}
                    <div 
                      onClick={() => setSelectedPaymentMethod("daviplata")}
                      style={{
                        backgroundColor: selectedPaymentMethod === "daviplata" ? "rgba(239, 68, 68, 0.15)" : "#18181b",
                        border: selectedPaymentMethod === "daviplata" ? "1px solid #ef4444" : "1px solid #27272a",
                        borderRadius: "8px", padding: "10px 4px", textAlign: "center", cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: selectedPaymentMethod === "daviplata" ? "#ef4444" : "#ffffff", display: "block" }}>
                        ❤️ Daviplata
                      </span>
                    </div>
                  </div>

                  {/* MENSAJES DINÁMICOS */}
                  <div style={{ marginTop: "10px", backgroundColor: "#141416", padding: "8px 12px", borderRadius: "6px", borderLeft: "3px solid #2563eb", fontSize: "11px", color: "#d4d4d8", lineHeight: "1.4" }}>
                    {selectedPaymentMethod === "nequi" && (
                      <div style={{ margin: 0 }}>
                        ⏱️ El pago por este método tarda aproximadamente <strong>25 minutes</strong> en confirmar.<br />
                        🔑 Enviar a la cuenta Nequi: <strong style={{ color: "#ffffff" }}>3147455770</strong>
                      </div>
                    )}
                    {selectedPaymentMethod === "bancolombia" && (
                      <div style={{ margin: 0 }}>
                        ⏱️ El pago por este método tarda aproximadamente <strong>30 minutos</strong> en confirmar.<br />
                        🔑 Transferir a Cuenta de Ahorros: <strong style={{ color: "#ffffff" }}>551-000234-91</strong>
                      </div>
                    )}
                    {selectedPaymentMethod === "daviplata" && (
                      <div style={{ margin: 0 }}>
                        ⏱️ El pago por este método tarda aproximadamente <strong>20 minutos</strong> en confirmar.<br />
                        🔑 Enviar al Daviplata: <strong style={{ color: "#ffffff" }}>3147455770</strong>
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Nota u observación del partido/evento..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  disabled={!endTime}
                  style={{ width: "100%", backgroundColor: "#111111", border: "1px solid #27272a", borderRadius: "8px", padding: "10px", color: "#ffffff", opacity: !endTime ? 0.5 : 1, marginTop: "4px" }}
                />

                <button
                  type="submit"
                  disabled={!endTime || amountPaid > totalAmount || amountPaid < Math.min(25000, totalAmount)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: (!endTime || amountPaid > totalAmount || amountPaid < Math.min(25000, totalAmount)) ? "#27272a" : "#2563eb",
                    color: (!endTime || amountPaid > totalAmount || amountPaid < Math.min(25000, totalAmount)) ? "#71717a" : "#ffffff",
                    fontWeight: 700,
                    cursor: (!endTime || amountPaid > totalAmount || amountPaid < Math.min(25000, totalAmount)) ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    marginTop: "16px"
                  }}
                >
                  {amountPaid > totalAmount
                    ? "Abono excede el total"
                    : amountPaid < Math.min(25000, totalAmount)
                      ? "Monto mínimo no alcanzado ($25.000)"
                      : "Concluir y Agendar Reserva"}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL INFORMATIVO DETALLADO ─── */}
      {infoBusiness && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
          <div style={{ backgroundColor: "#131314", padding: "28px", borderRadius: "16px", border: "1px solid #27272a", width: "100%", maxWidth: "460px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>{infoBusiness.name}</h2>
              <button type="button" onClick={() => setInfoBusiness(null)} style={{ backgroundColor: "transparent", border: "none", color: "#71717a", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ width: "100%", height: "180px", borderRadius: "10px", overflow: "hidden", border: "1px solid #27272a" }}>
              <img src={infoBusiness.imageUrl || "https://placehold.co/600x400"} alt="Vista" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#52525b", fontWeight: 700, textTransform: "uppercase" }}>Descripción General</span>
                <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#a1a1aa", lineHeight: "1.5" }}>{infoBusiness.description || "Sin descripción de servicios añadida por el administrador."}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid #27272a", paddingTop: "12px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#52525b", fontWeight: 700, textTransform: "uppercase" }}>Ubicación</span>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#ffffff" }}>{infoBusiness.city} • {infoBusiness.address}</p>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#52525b", fontWeight: 700, textTransform: "uppercase" }}>Contacto directo</span>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#ffffff", wordBreak: "break-all" }}>{infoBusiness.email || "No provisto"}</p>
                </div>
                {/* 🌟 TELÉFONO DE CONTACTO AÑADIDO ACÁ */}
                  {infoBusiness.phone && (
                    <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={14} style={{ color: "#10b981" }} /> <span>{infoBusiness.phone}</span>
                    </p>
                  )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setInfoBusiness(null); handleSelectBusiness(infoBusiness); }}
              style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px", marginTop: "8px", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}
            >
              Pasar al Formulario de Reserva
            </button>
          </div>
        </div>
      )}

      {/* ─── 🚨 SÚPER AVISO CENTRAL DE RESERVA EXITOSA (AJUSTADO A 40 SEGUNDOS) ─── */}
      {showSuccessAlert && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.85)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 9999, padding: "20px", backdropFilter: "blur(5px)"
        }}>
          <div style={{
            backgroundColor: "#18181b", border: "2px solid #22c55e", borderRadius: "16px",
            padding: "30px", maxWidth: "500px", width: "100%", textAlign: "center",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
            position: "relative", animation: "fadeIn 0.3s ease-out"
          }}>
            
            {/* Ícono de Check Gigante */}
            <div style={{
              width: "60px", height: "60px", backgroundColor: "rgba(34, 197, 94, 0.1)",
              borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
              margin: "0 auto 16px auto", border: "2px solid #22c55e"
            }}>
              <span style={{ fontSize: "30px" }}>✅</span>
            </div>

            <h3 style={{ color: "#ffffff", fontSize: "22px", fontWeight: "bold", margin: "0 0 12px 0", fontFamily: "system-ui, sans-serif" }}>
              ¡Reserva Agendada con Éxito!
            </h3>

            <p style={{ color: "#d4d4d8", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
              Una vez hayas realizado el pago, el estado de tu reserva cambiará de 
              <span style={{ color: "#f59e0b", fontWeight: "bold" }}> PENDIENTE </span> a 
              <span style={{ color: "#22c55e", fontWeight: "bold" }}> CONFIRMADA</span>.
            </p>

            {/* Caja de Advertencia de Tiempo */}
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444",
              borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#fca5a5",
              lineHeight: "1.4", marginBottom: "20px", textAlign: "left"
            }}>
              ⚠️ <strong>Recuerda:</strong> Debes realizar y reportar el pago en los próximos 
              <strong style={{ color: "#ffffff" }}> 30 minutos</strong>. De lo contrario, el sistema cancelará la reserva automáticamente .
            </div>

            {/* Barra de progreso visual ajustada a 40 segundos */}
            <div style={{ width: "100%", backgroundColor: "#27272a", height: "4px", borderRadius: "2px", overflow: "hidden", marginBottom: "15px" }}>
              <div style={{
                height: "100%", backgroundColor: "#22c55e", width: "100%",
                animation: "shrinkBar 40s linear forwards"
              }} />
            </div>

            <button 
              onClick={() => setShowSuccessAlert(false)}
              style={{
                backgroundColor: "transparent", border: "none", color: "#a1a1aa",
                fontSize: "12px", cursor: "pointer", textDecoration: "underline"
              }}
            >
              Cerrar aviso ahora
            </button>
          </div>
        </div>
      )}

      {/* Estilos CSS rápidos para las animaciones del aviso */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

    </div>
  );
}