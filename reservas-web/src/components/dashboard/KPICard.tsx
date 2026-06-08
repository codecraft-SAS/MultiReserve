import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string; // clases tailwind como "text-blue-500" o "text-emerald-500"
  subtitle?: string; // texto pequeño debajo del título (opcional)
}

const BG_MAP: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/20",
  emerald: "bg-emerald-500/10 border-emerald-500/20",
  violet: "bg-violet-500/10 border-violet-500/20",
  amber: "bg-amber-500/10 border-amber-500/20",
  rose: "bg-rose-500/10 border-rose-500/20",
  indigo: "bg-indigo-500/10 border-indigo-500/20",
};

const detectBgClass = (colorClass: string) => {
  if (!colorClass) return "bg-slate-500/10 border-slate-500/20";
  const key = Object.keys(BG_MAP).find((k) => colorClass.includes(k));
  return key ? BG_MAP[key] : "bg-slate-500/10 border-slate-500/20";
};

export default function KpiCard({
  title,
  value,
  icon,
  color = "text-blue-500",
  subtitle,
}: KpiCardProps) {
  const bgClass = detectBgClass(color);

  return (
    <div
      role="group"
      aria-label={`${title} KPI`}
      className="
        bg-slate-900
        rounded-2xl
        shadow-md
        shadow-slate-950/50
        border
        border-slate-800/80
        p-5
        hover:border-slate-700/80
        transition-all
        duration-300
        group
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </p>

        <div className="mt-1 flex items-baseline gap-3">
          <h2 className="text-3xl font-bold text-white tracking-tight truncate" title={String(value)}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </h2>
          {subtitle && (
            <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
          )}
        </div>
      </div>

      <div
        className={`
          w-12
          h-12
          rounded-xl
          flex
          items-center
          justify-center
          border
          transition-transform
          duration-300
          group-hover:scale-110
          ${color}
          ${bgClass}
        `}
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
  );
}
