// src/scripts/api/posts.js

// 🔹 Dirección base del backend
const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * 🔹 Headers base para peticiones JSON
 * Nota: ya NO usamos Authorization con Bearer Token,
 * sino cookies de sesión (credentials: 'include').
 */
const baseHeaders = {
  "Content-Type": "application/json",
};

/**
 * 🔹 Obtener el feed de publicaciones (Social.astro)
 */
export async function fetchFeed(page = 1, limit = 10, filter = "all") {
  try {
    const response = await fetch(
      `${API_URL}/posts/feed?page=${page}&limit=${limit}&filter=${filter}`,
      {
        headers: baseHeaders,
        credentials: "include", // ✅ envia la cookie de sesión
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar el feed");
    }

    const data = await response.json();
    return data.posts || data;
  } catch (error) {
    console.error("❌ Error en fetchFeed:", error);
    throw error;
  }
}

/**
 * 🔹 Crear nueva publicación
 */
export async function createPost(postData) {
  try {
    const bodyData = {
  caption: postData.caption?.trim() || "",
  images: postData.images || [], // Puede ser un array de URLs o base64
};

const response = await fetch(`${API_URL}/posts`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bodyData),
});

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear publicación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en createPost:", error);
    throw error;
  }
}

/**
 * 🔹 Dar like a una publicación
 */
export async function likePost(postId) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "POST",
      credentials: "include", // ✅ permite sesión
      headers: baseHeaders,
    });

    if (!response.ok) {
      throw new Error("Error al dar like");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en likePost:", error);
    throw error;
  }
}

/**
 * 🔹 Guardar publicación
 */
export async function savePost(postId) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/save`, {
      method: "POST",
      credentials: "include",
      headers: baseHeaders,
    });

    if (!response.ok) {
      throw new Error("Error al guardar publicación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en savePost:", error);
    throw error;
  }
}

/**
 * 🔹 Compartir publicación
 */
export async function sharePost(postId) {
  try {
    const url = `${window.location.origin}/post/${postId}`;
    if (navigator.share) {
      await navigator.share({ title: "Compartir publicación", url });
      return { shared: true };
    } else {
      await navigator.clipboard.writeText(url);
      return { copied: true };
    }
  } catch (error) {
    console.error("❌ Error en sharePost:", error);
    throw error;
  }
}

/**
 * 🔹 Eliminar publicación
 */
export async function deletePost(postId) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
      headers: baseHeaders,
    });

    if (!response.ok) {
      throw new Error("Error al eliminar publicación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en deletePost:", error);
    throw error;
  }
}

/**
 * 🔹 Obtener comentarios
 */
export async function getComments(postId) {
  try {
    const response = await fetch(`${API_URL}/comments/${postId}`, {
      credentials: "include",
      headers: baseHeaders,
    });

    if (!response.ok) {
      throw new Error("Error al cargar comentarios");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en getComments:", error);
    throw error;
  }
}

/**
 * 🔹 Agregar comentario
 */
export async function addComment(postId, text) {
  try {
    const response = await fetch(`${API_URL}/comments/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: baseHeaders,
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar comentario");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en addComment:", error);
    throw error;
  }
}

/**
 * 🔹 Editar publicación
 */
export async function updatePost(postId, updateData) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "PATCH",
      credentials: "include",
      headers: baseHeaders,
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar publicación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en updatePost:", error);
    throw error;
  }
}

/**
 * 🔹 Reportar publicación
 */
export async function reportPost(postId, reason) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/report`, {
      method: "POST",
      credentials: "include",
      headers: baseHeaders,
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error("Error al reportar publicación");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en reportPost:", error);
    throw error;
  }
}

