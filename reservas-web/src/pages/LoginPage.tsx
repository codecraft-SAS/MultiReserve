import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Check, Eye, EyeOff } from "lucide-react";

export default function LoginPage({ onSuccess, onGoToRegister }: { onSuccess: (role: string) => void; onGoToRegister?: () => void }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasEmailValue = email.trim().length > 0;
  const hasPasswordValue = password.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, rellena todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const userData = await login({ email, password });

      toast.success("¡Bienvenido de nuevo!");

      const userRole = (userData?.role ?? "").toUpperCase();
      onSuccess(userRole);
    } catch {
      toast.error("Credenciales incorrectas. Revisa tu correo y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        fontFamily: "sans-serif",
        overflowX: "hidden",
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxSizing: "border-box",
        padding: "40px 20px",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 1, pointerEvents: "none" }} />

      <header style={{ position: "absolute", top: "24px", left: "40px", zIndex: 10 }}>
        <span style={{ fontSize: "28px", fontWeight: 900, color: "#2563eb", letterSpacing: "-1px", textTransform: "uppercase" }}>
          Multi<span style={{ color: "#ffffff", fontWeight: 300, fontSize: "22px", letterSpacing: "0px", textTransform: "lowercase" }}>reserve</span>
        </span>
      </header>

      <main
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          borderRadius: "8px",
          padding: "50px 68px",
          boxSizing: "border-box",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", margin: "0 0 28px 0", letterSpacing: "-0.5px" }}>
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#333333",
                color: "#ffffff",
                borderRadius: "4px",
                padding: "14px 20px",
                fontSize: "16px",
                fontWeight: 500,
                boxSizing: "border-box",
                outline: "none",
                border: hasEmailValue ? "1px solid rgba(34, 197, 94, 0.65)" : "1px solid transparent",
                boxShadow: hasEmailValue ? "0 0 0 1px rgba(34, 197, 94, 0.18)" : "none",
                paddingRight: hasEmailValue ? "48px" : "20px"
              }}
              disabled={loading}
              required
            />
            {hasEmailValue && (
              <div
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none"
                }}
                aria-hidden="true"
              >
                <Check size={18} />
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#333333",
                color: "#ffffff",
                borderRadius: "4px",
                padding: "14px 48px 14px 20px",
                fontSize: "16px",
                fontWeight: 500,
                boxSizing: "border-box",
                outline: "none",

                border: hasPasswordValue ? "1px solid rgba(34, 197, 94, 0.65)" : "1px solid transparent",
                boxShadow: hasPasswordValue ? "0 0 0 1px rgba(34, 197, 94, 0.18)" : "none",
                paddingRight: hasPasswordValue ? "76px" : "48px"
              }}
              disabled={loading}
              required
            />
            {hasPasswordValue && (
              <div
                style={{
                  position: "absolute",
                  right: "48px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none"
                }}
                aria-hidden="true"
              >
                <Check size={18} />
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#8c8c8c",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#737373", padding: "0 4px" }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: "pointer", accentColor: "#2563eb" }}
            />
            <label htmlFor="rememberMe" style={{ cursor: "pointer", userSelect: "none" }}>Recordarme</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "14px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              marginTop: "12px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
            }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div style={{ marginTop: "40px", fontSize: "14px", color: "#737373" }}>
          <p style={{ margin: "0" }}>
            ¿Primera vez en MultiReserve?{" "}
            <button
              onClick={onGoToRegister}
              style={{ color: "#ffffff", textDecoration: "none", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Suscríbete ahora
            </button>
          </p>
        </div>
      </main>

      <footer
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.8)",
          borderTop: "1px solid #222222",
          padding: "16px 0",
          textAlign: "center",
          fontSize: "12px",
          color: "#555555",
          zIndex: 10,
        }}
      >
        MultiReserve Corporation &copy; {new Date().getFullYear()} - Todos los derechos reservados.
      </footer>
    </div>
  );
}
