import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

const kpis = [
  {
    title: "Reservas activas",
    value: "128",
    change: "+12% vs. ayer",
    icon: CalendarClock,
    accent: "from-sky-500/20 to-cyan-500/5",
    iconColor: "text-sky-400",
  },
  {
    title: "Ingresos del mes",
    value: "$ 24.8k",
    change: "+8.4% crecimiento",
    icon: CircleDollarSign,
    accent: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    title: "Negocios activos",
    value: "36",
    change: "4 nuevos esta semana",
    icon: Store,
    accent: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
  },
  {
    title: "Usuarios registrados",
    value: "1,482",
    change: "98% verificados",
    icon: Users,
    accent: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-300",
  },
];

const activity = [
  {
    title: "Nueva reserva confirmada",
    detail: "Cancha principal · 18:30 - 20:00",
    time: "Hace 6 min",
    tone: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  },
  {
    title: "Negocio aprobado",
    detail: "Restaurante Aurora ya está visible en el catálogo",
    time: "Hace 22 min",
    tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  {
    title: "Pago recibido",
    detail: "Reserva #2048 marcada como completada",
    time: "Hace 1 h",
    tone: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  },
];

const quickActions = [
  {
    title: "Crear negocio",
    description: "Registra nuevas sedes, servicios y horarios disponibles.",
    icon: LayoutGrid,
  },
  {
    title: "Revisar reservas",
    description: "Gestiona solicitudes pendientes y asigna recursos.",
    icon: Clock3,
  },
  {
    title: "Ver desempeño",
    description: "Consulta métricas de crecimiento y ocupación.",
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-12%] h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute right-[-8%] top-[18%] h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[-14%] left-[20%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),transparent_35%,rgba(168,85,247,0.08)_70%,transparent)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                <Sparkles size={14} />
                Panel ejecutivo
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Dashboard Admin
                </h1>
                <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Una vista de control con métricas clave, estado operativo y accesos rápidos para gestionar la plataforma con una lectura clara y elegante.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5">
                  Abrir panel
                  <ArrowRight size={16} />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  Revisar actividad
                </button>
              </div>
            </div>

            <div className="grid w-full max-w-md grid-cols-2 gap-4 rounded-2xl border border-white/8 bg-slate-950/70 p-4 shadow-xl shadow-black/20">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                  Prioridad
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">Operación estable</p>
                    <p className="text-xs text-slate-400">Sin alertas críticas</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                  Rendimiento
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                    <BadgeCheck size={20} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">96% ocupación</p>
                    <p className="text-xs text-slate-400">Meta semanal superada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={`relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${item.accent} p-5 shadow-lg shadow-black/25 backdrop-blur-xl`}
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {item.title}
                    </p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-white">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{item.change}</p>
                  </div>

                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${item.iconColor}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <article className="rounded-3xl border border-white/8 bg-white/[0.04] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Actividad reciente
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">Seguimiento operativo</h2>
              </div>
              <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                Últimas 24 horas
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {activity.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                  <div className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border ${item.tone}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl border border-white/8 bg-slate-950/70 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Accesos rápidos
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">Flujo de trabajo</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {quickActions.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-4 transition-transform hover:-translate-y-0.5 hover:border-sky-500/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300 transition-colors group-hover:bg-sky-500/15">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <ArrowRight size={16} className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-slate-300" />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-sky-500/20 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(15,23,42,0.75))] p-5">
              <div className="flex items-center gap-3 text-sky-200">
                <Sparkles size={18} />
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Estado general</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                La plataforma está lista para operar con una interfaz más jerárquica, legible y visualmente premium.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}