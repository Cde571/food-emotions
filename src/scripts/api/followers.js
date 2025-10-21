// ============================================================
// 📁 src/scripts/api/followers.js
// API para seguir / dejar de seguir / obtener seguidores y seguidos
// ============================================================

const baseURL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

/**
 * 🔹 Seguir a un usuario por su ID
 * @param {string} userId - ID del usuario a seguir
 */
export async function followUser(userId) {
  try {
    const res = await fetch(`${baseURL}/profile/follow/${userId}`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error al seguir: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("❌ Error en followUser:", err);
    throw err;
  }
}

/**
 * 🔹 Dejar de seguir a un usuario
 * @param {string} userId - ID del usuario a dejar de seguir
 */
export async function unfollowUser(userId) {
  try {
    const res = await fetch(`${baseURL}/profile/unfollow/${userId}`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error al dejar de seguir: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("❌ Error en unfollowUser:", err);
    throw err;
  }
}

/**
 * 🔹 Obtener la lista de seguidores del usuario actual o de otro
 * @param {string} [userId] - Opcional: ID del usuario del que obtener seguidores
 */
export async function getFollowers(userId = null) {
  try {
    const endpoint = userId
      ? `${baseURL}/users/${userId}/followers`
      : `${baseURL}/users/me/followers`;

    const res = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error obteniendo seguidores");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en getFollowers:", err);
    throw err;
  }
}

/**
 * 🔹 Obtener la lista de usuarios que sigue el usuario actual o uno específico
 * @param {string} [userId] - Opcional: ID del usuario del que obtener los seguidos
 */
export async function getFollowing(userId = null) {
  try {
    const endpoint = userId
      ? `${baseURL}/users/${userId}/following`
      : `${baseURL}/users/me/following`;

    const res = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error obteniendo seguidos");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en getFollowing:", err);
    throw err;
  }
}

/**
 * 🔹 Verificar si el usuario actual sigue a otro
 * @param {string} userId - ID del usuario a verificar
 * @returns {boolean} true si lo sigue, false si no
 */
export async function isFollowing(userId) {
  try {
    const res = await fetch(`${baseURL}/users/me/following`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error al verificar seguimiento");

    const followingList = await res.json();
    return followingList.some((u) => u._id === userId);
  } catch (err) {
    console.error("❌ Error en isFollowing:", err);
    return false;
  }
}
