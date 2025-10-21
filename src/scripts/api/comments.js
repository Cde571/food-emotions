// src/scripts/api/comments.js
export async function getComments(postId) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`/api/posts/${postId}/comments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al cargar comentarios');
  return res.json();
}

export async function addComment(postId, text) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Error al comentar');
  return res.json();
}
