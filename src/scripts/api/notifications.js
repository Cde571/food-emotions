// src/scripts/api/notifications.js

const API_BASE = '/api/notifications';

// 🔹 Obtener todas las notificaciones del usuario
export async function getNotifications() {
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch(API_BASE, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al obtener notificaciones');
    return await res.json();
  } catch (err) {
    console.error('❌ getNotifications:', err);
    return [];
  }
}

// 🔹 Marcar una notificación como leída
export async function markAsRead(notificationId) {
  try {
    const token = localStorage.getItem('authToken');
    await fetch(`${API_BASE}/${notificationId}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  } catch (err) {
    console.error('❌ markAsRead:', err);
  }
}

// 🔹 Marcar todas como leídas
export async function markAllAsRead() {
  try {
    const token = localStorage.getItem('authToken');
    await fetch(`${API_BASE}/read-all`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  } catch (err) {
    console.error('❌ markAllAsRead:', err);
  }
}
