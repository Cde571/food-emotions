// ============================================================
// 🔹 Obtener datos del usuario desde el backend (dinámico)
// ============================================================
async function fetchUserData() {
  try {
    const response = await fetch("http://localhost:3000/profile-data", {
      method: "GET",
      credentials: "include", // 🔥 Necesario para sesiones
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("⚠️ Sesión no válida. Redirigiendo a login...");
        window.location.href = "/login";
        return;
      }
      throw new Error(`Error al obtener perfil: ${response.statusText}`);
    }

    const userData = await response.json();

    // 🔹 Referencias seguras
    const nameEl = document.querySelector("#user-name");
    const teamEl = document.querySelector("#team-user-name");
    const bioEl = document.querySelector("#bio-description");
    const imgEl = document.querySelector("#profile-pic");
    const statusSelect = document.querySelector("#status-select");

    // 🔹 Actualizar información básica
    if (nameEl) nameEl.textContent = userData.userName || "Usuario";
    if (teamEl) teamEl.textContent = userData.userName || "Usuario";
    if (bioEl) bioEl.textContent = userData.bio || "Sin biografía disponible";
    if (statusSelect) statusSelect.value = userData.status || "Online";

    // 🔹 Imagen dinámica (Cloudinary o placeholder dinámico)
    if (imgEl) {
      if (userData.profilePic && userData.profilePic.startsWith("http")) {
        // Imagen Cloudinary
        imgEl.src = userData.profilePic;
      } else {
        // Placeholder dinámico con iniciales (no archivo local)
        const initials = (userData.userName || "?")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        imgEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          initials
        )}&background=72B340&color=fff`;
      }

      // Estilos garantizados
      imgEl.style.objectFit = "cover";
      imgEl.style.borderRadius = "50%";
      imgEl.style.width = "160px";
      imgEl.style.height = "160px";
    }

    console.log("✅ Perfil cargado:", userData);
  } catch (err) {
    console.error("❌ Error al obtener los datos del perfil:", err);
    const errorMessageElement = document.querySelector("#error-message");
    if (errorMessageElement) errorMessageElement.textContent = err.message;
  }
}

// ============================================================
// 🔹 Subir foto de perfil (Cloudinary)
// ============================================================
async function uploadProfilePic(file) {
  const formData = new FormData();
  formData.append("profilePic", file);

  try {
    const response = await fetch("http://localhost:3000/profile/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.profilePic) {
      console.error("❌ Respuesta del servidor:", data);
      alert(`Error al subir imagen: ${data.message || "Error desconocido"}`);
      return;
    }

    // ✅ Actualizar DOM con la nueva foto
    const imgEl = document.getElementById("profile-pic");
    if (imgEl) {
      imgEl.src = data.profilePic;
      imgEl.style.objectFit = "cover";
      imgEl.style.borderRadius = "50%";
    }

    console.log("✅ Imagen actualizada:", data.profilePic);
    alert("✅ Foto actualizada correctamente.");
  } catch (err) {
    console.error("Error en uploadProfilePic():", err);
    alert("❌ Error inesperado al subir imagen.");
  }
}

// ============================================================
// 🔹 Cerrar sesión
// ============================================================
async function logout() {
  try {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  } catch (err) {
    console.error("Error al cerrar sesión:", err.message);
  }
}

// ============================================================
// 🔹 Cambiar estado del usuario
// ============================================================
async function handleStatusChange(event) {
  const status = event.target.value;
  try {
    const response = await fetch("http://localhost:3000/profile/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!response.ok) console.error("Error al actualizar el estado");
  } catch (error) {
    console.error("Error en la solicitud de estado:", error);
  }
}

// ============================================================
// 🔹 Guardar biografía del usuario
// ============================================================
async function saveBio() {
  const bioElement = document.getElementById("bio-editor");
  if (!bioElement) return;

  const bio = bioElement.value;
  try {
    const response = await fetch("http://localhost:3000/profile/bio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bio }),
    });

    if (!response.ok) console.error("Error al actualizar biografía");
    else alert("✅ Biografía actualizada correctamente");
  } catch (error) {
    console.error("Error en la solicitud de biografía:", error);
  }
}

// ============================================================
// 🔹 Inicializar eventos
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos del usuario
  fetchUserData();

  // Logout
  const logoutButton = document.querySelector("#logout-button");
  if (logoutButton) logoutButton.addEventListener("click", logout);

  // Cambiar estado
  const statusSelect = document.querySelector("#status-select");
  if (statusSelect) statusSelect.addEventListener("change", handleStatusChange);

  // Guardar biografía
  const bioEditor = document.querySelector("#bio-editor");
  if (bioEditor) bioEditor.addEventListener("blur", saveBio);

  // Subir nueva foto
  const uploadBtn = document.getElementById("upload-btn");
  const uploadInput = document.getElementById("upload-input");
  if (uploadBtn && uploadInput) {
    uploadBtn.addEventListener("click", () => uploadInput.click());
    uploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) uploadProfilePic(file);
    });
  }
});


