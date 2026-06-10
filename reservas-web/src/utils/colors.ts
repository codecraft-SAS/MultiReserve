export const colors = {
  // Backgrounds
  bgApp: "#09090b",
  bgCard: "#131314",
  bgCardAlt: "#18181b",
  bgCardLight: "#1a1a1a",
  bgInput: "#111111",
  bgHover: "rgba(255, 255, 255, 0.03)",
  glass: "rgba(23, 23, 23, 0.6)",

  // Borders
  border: "#27272a",
  borderSubtle: "rgba(255, 255, 255, 0.05)",
  divider: "#1c1c1f",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#e4e4e7",
  textMuted: "#a1a1aa",
  textDim: "#71717a",
  textDimmer: "#52525b",

  // Primary
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  primaryDark: "#1d4ed8",

  // Status
  success: "#10b981",
  successLight: "#34d399",
  warning: "#f59e0b",
  warningLight: "#fbbf24",
  danger: "#ef4444",
  dangerLight: "#f87171",
  info: "#60a5fa",

  // Accents (KPIs)
  purple: "#8b5cf6",
  pink: "#ec4899",
  teal: "#06b6d4",
  orange: "#fb923c",
  indigo: "#6366f1",
} as const;

// Standard layout patterns
export const layout = {
  page: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  header: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    color: colors.textPrimary,
    margin: 0,
    letterSpacing: "-0.5px",
  },
  description: {
    fontSize: "14px",
    color: colors.textMuted,
    margin: 0,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    padding: "28px",
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "12px",
  },
  field: {
    width: "100%",
    backgroundColor: colors.bgInput,
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    padding: "10px",
    color: colors.textPrimary,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  fieldInline: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
  },
} as const;

export const buttons = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.textPrimary,
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },
  primaryDisabled: {
    backgroundColor: colors.border,
    color: colors.textDim,
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "not-allowed",
  },
  secondary: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.border}`,
    color: colors.textMuted,
    borderRadius: "8px",
    padding: "12px 20px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  inline: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "6px",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
  },
} as const;

// Status badge generator
export interface BadgeStyle {
  display: string;
  alignItems: string;
  gap: string;
  padding: string;
  borderRadius: string;
  fontSize: string;
  fontWeight: number;
  letterSpacing: string;
  color: string;
  backgroundColor: string;
  border: string;
}

export const statusBadges: Record<string, BadgeStyle> = {
  CONFIRMED: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    color: "#34d399",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    border: "1px solid rgba(52, 211, 153, 0.2)",
  },
  PENDING: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    color: "#fbbf24",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    border: "1px solid rgba(251, 191, 36, 0.2)",
  },
  COMPLETED: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    color: "#60a5fa",
    backgroundColor: "rgba(96, 165, 250, 0.1)",
    border: "1px solid rgba(96, 165, 250, 0.2)",
  },
  CANCELLED: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    color: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  REJECTED: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    color: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
};

// Reusable empty state
export const emptyState = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center" as const,
  },
  icon: {
    width: "44px",
    height: "44px",
    color: colors.textDimmer,
    marginBottom: "16px",
  },
  title: {
    fontSize: "16px",
    fontWeight: 700,
    color: colors.textMuted,
    margin: "0 0 4px 0",
  },
  message: {
    fontSize: "13px",
    color: colors.textDim,
    margin: 0,
  },
};

// Reusable loading spinner
export const loadingSpinner = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "3px solid #27272a",
    borderTopColor: "#2563eb",
    animation: "spin 0.8s linear infinite",
    boxSizing: "border-box" as const,
  },
};
