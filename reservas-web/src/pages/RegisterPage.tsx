import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage({ onSuccess }: { onSuccess: (role: string) => void }) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Por favor, rellena todos los campos obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      await register({ fullName: name, email, password, role: "CLIENT" });

      toast.success("¡Cuenta creada con éxito! Bienvenido.");
      onSuccess("CLIENT");
    } catch {
      toast.error("Error al registrarse. El correo podría estar en uso o hubo un fallo en el servidor.");
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
          Crear cuenta
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#333333",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "14px 20px",
                fontSize: "16px",
                fontWeight: 500,
                boxSizing: "border-box",
                outline: "none",
              }}
              disabled={loading}
              required
            />
          </div>

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
                border: "none",
                borderRadius: "4px",
                padding: "14px 20px",
                fontSize: "16px",
                fontWeight: 500,
                boxSizing: "border-box",
                outline: "none",
              }}
              disabled={loading}
              required
            />
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
                border: "none",
                borderRadius: "4px",
                padding: "14px 48px 14px 20px",
                fontSize: "16px",
                fontWeight: 500,
                boxSizing: "border-box",
                outline: "none",
              }}
              disabled={loading}
              required
            />
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

          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#333333",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "14px 48px 14px 20px",
                fontSize: "16px",
                fontWeight: 500,
                boxSizing: "border-box",
                outline: "none",
              }}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div style={{ marginTop: "32px", fontSize: "14px", color: "#737373", textAlign: "center" }}>
          <p style={{ margin: "0" }}>
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={() => onSuccess("LOGIN")}
              style={{ color: "#ffffff", textDecoration: "none", fontWeight: 500, cursor: "pointer" }}
            >
              Inicia sesión
            </span>
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
