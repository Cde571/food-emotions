// src/scripts/api/auth.js

const API_BASE = "/auth";

/**
 * 🔹 Iniciar sesión manual (email y password)
 */
export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    const data = await res.json();

    // Guardamos token y userId en localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userId", data.user._id);

    return data;
  } catch (err) {
    console.error("❌ Error en login:", err);
    throw err;
  }
}

/**
 * 🔹 Verificar si el usuario está autenticado
 */
export async function getAuthStatus() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return { authenticated: false };

    const res = await fetch(`${API_BASE}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Token inválido");

    const user = await res.json();
    return { authenticated: true, user };
  } catch (err) {
    console.warn("⚠️ Usuario no autenticado:", err.message);
    return { authenticated: false };
  }
}

/**
 * 🔹 Cerrar sesión
 */
export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  window.location.href = "/login";
}

/**
 * 🔹 Iniciar sesión con Google
 */
export function loginWithGoogle() {
  window.location.href = `${API_BASE}/google`;
}

/**
 * 🔹 Manejar callback de Google (cuando el backend redirige)
 */
export function handleGoogleCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userId = params.get("userId");

  if (token && userId) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId);
    window.location.href = "/Social";
  } else {
    console.error("❌ Callback de Google inválido");
  }
}
