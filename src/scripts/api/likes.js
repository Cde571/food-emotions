// ============================================================
// ❤️ src/scripts/api/likes.js
// API para manejar likes en posts (compatible con Social.astro)
// ============================================================

const baseURL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

/**
 * 🔹 Dar o quitar "like" a una publicación
 * @param {string} postId - ID del post
 */
export async function toggleLike(postId) {
  try {
    const res = await fetch(`${baseURL}/api/posts/${postId}/like`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al dar like");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en toggleLike:", err);
    throw err;
  }
}

/**
 * 🔹 Obtener los likes de un post específico
 * @param {string} postId - ID del post
 */
export async function getLikes(postId) {
  try {
    const res = await fetch(`${baseURL}/api/posts/${postId}/likes`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error obteniendo likes");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en getLikes:", err);
    return [];
  }
}

/**
 * 🔹 Verificar si el usuario actual ha dado like a un post
 * @param {string} postId - ID del post
 * @returns {boolean}
 */
export async function hasLiked(postId) {
  try {
    const res = await fetch(`${baseURL}/api/posts/${postId}/likes`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error obteniendo likes");
    const likes = await res.json();
    const currentUserId = localStorage.getItem("userId");
    return likes.some((u) => u._id === currentUserId);
  } catch (err) {
    console.error("⚠️ Error en hasLiked:", err);
    return false;
  }
}
