// ============================================================
// 💬 src/scripts/api/messages.js
// API para chat directo entre usuarios
// Compatible con socketClient.js y Social.astro
// ============================================================

const baseURL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

/**
 * 🔹 Obtener las conversaciones del usuario actual
 */
export async function fetchConversations() {
  try {
    const res = await fetch(`${baseURL}/api/messages/conversations`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error obteniendo conversaciones");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en fetchConversations:", err);
    return [];
  }
}

/**
 * 🔹 Obtener los mensajes de una conversación específica
 * @param {string} conversationId - ID de la conversación
 */
export async function fetchMessages(conversationId) {
  try {
    const res = await fetch(`${baseURL}/api/messages/${conversationId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error obteniendo mensajes");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en fetchMessages:", err);
    return [];
  }
}

/**
 * 🔹 Enviar un nuevo mensaje
 * @param {string} recipientId - ID del usuario receptor
 * @param {string} text - Contenido del mensaje
 */
export async function sendMessage(recipientId, text) {
  try {
    const res = await fetch(`${baseURL}/api/messages/send`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId, text }),
    });
    if (!res.ok) throw new Error("Error al enviar mensaje");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en sendMessage:", err);
    throw err;
  }
}

/**
 * 🔹 Marcar mensajes como leídos
 * @param {string} conversationId - ID de la conversación
 */
export async function markAsRead(conversationId) {
  try {
    await fetch(`${baseURL}/api/messages/${conversationId}/read`, {
      method: "PUT",
      credentials: "include",
    });
  } catch (err) {
    console.error("⚠️ Error al marcar como leído:", err);
  }
}
