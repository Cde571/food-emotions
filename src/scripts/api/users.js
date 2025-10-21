// src/scripts/api/users.js

const API_BASE = "/api/users";

// 🔹 Obtener datos del usuario actual (autenticado)
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("No se pudo obtener el usuario actual");
    return await res.json(); // { _id, username, profilePic, email, ... }
  } catch (err) {
    console.error("❌ getCurrentUser:", err);
    return null;
  }
}

// 🔹 Obtener un usuario por ID
export async function getUserById(userId) {
  try {
    const res = await fetch(`${API_BASE}/${userId}`);
    if (!res.ok) throw new Error("Error al obtener usuario");
    return await res.json();
  } catch (err) {
    console.error("❌ getUserById:", err);
    return null;
  }
}

// 🔹 Actualizar información de perfil
export async function updateUserProfile(userId, data) {
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar perfil");
    return await res.json();
  } catch (err) {
    console.error("❌ updateUserProfile:", err);
    throw err;
  }
}

// 🔹 Cerrar sesión
export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  window.location.href = "/login";
}
