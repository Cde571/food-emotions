// ============================================================
// 🔹 Obtener datos del usuario desde el backend
// ============================================================
async function fetchUserData() {
  try {
    const response = await fetch('http://localhost:3000/profile-data', {
      method: 'GET',
      credentials: 'include', // Necesario para sesiones Google
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      throw new Error(`Error al obtener datos del perfil: ${response.statusText}`);
    }

    const userData = await response.json();

    // Actualizar el DOM con los datos del usuario
    document.querySelector('#user-name').textContent = userData.userName || 'Usuario';
    document.querySelector('#team-user-name').textContent = userData.userName || 'Usuario';
    document.querySelector('#bio-description').textContent = userData.bio || 'Descripción no disponible';
    document.querySelector('#profile-pic').src = userData.profilePic || 'src/img/Image (4).png';

    const statusSelect = document.querySelector('#status-select');
    if (statusSelect) statusSelect.value = userData.status || 'Online';
  } catch (err) {
    console.error('Error al obtener los datos del perfil:', err.message);
    const errorMessageElement = document.querySelector('#error-message');
    if (errorMessageElement) errorMessageElement.textContent = err.message;
  }
}

// ============================================================
// 🔹 Cerrar sesión
// ============================================================
async function logout() {
  try {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('token');
    window.location.href = '/login';
  } catch (err) {
    console.error('Error al cerrar sesión:', err.message);
  }
}

// ============================================================
// 🔹 Cambiar estado (próxima funcionalidad backend)
// ============================================================
async function handleStatusChange(event) {
  const status = event.target.value;
  try {
    const response = await fetch('http://localhost:3000/profile/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    if (!response.ok) console.error('Error al actualizar el estado');
  } catch (error) {
    console.error('Error en la solicitud de estado:', error);
  }
}

// ============================================================
// 🔹 Guardar biografía (próxima funcionalidad backend)
// ============================================================
async function saveBio() {
  const bioElement = document.getElementById('bio-editor');
  if (!bioElement) return;
  const bio = bioElement.value;

  try {
    const response = await fetch('http://localhost:3000/profile/bio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ bio }),
    });

    if (!response.ok) {
      console.error('Error al actualizar biografía');
    } else {
      alert('Biografía actualizada');
    }
  } catch (error) {
    console.error('Error en la solicitud de biografía:', error);
  }
}

// ============================================================
// 🔹 Abrir modal de followers o likes (opcional futuro)
// ============================================================
async function openModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;
  modalElement.classList.remove('hidden');

  try {
    const endpoint =
      modalId === 'followersModal'
        ? 'http://localhost:3000/profile/followers'
        : 'http://localhost:3000/profile/likes';

    const response = await fetch(endpoint, { credentials: 'include' });
    const data = await response.json();
    const listElement = document.getElementById(
      modalId === 'followersModal' ? 'followersList' : 'likesList'
    );

    listElement.innerHTML = data.map(u => `<li>${u.username}</li>`).join('');
  } catch (error) {
    console.error(`Error al obtener datos para ${modalId}:`, error);
  }
}

function closeModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) modalElement.classList.add('hidden');
}

// ============================================================
// 🔹 Inicializar eventos al cargar el documento
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  fetchUserData();

  const logoutButton = document.querySelector('#logout-button');
  if (logoutButton) logoutButton.addEventListener('click', logout);

  const statusSelect = document.querySelector('#status-select');
  if (statusSelect) statusSelect.addEventListener('change', handleStatusChange);

  const bioEditor = document.querySelector('#bio-editor');
  if (bioEditor) bioEditor.addEventListener('blur', saveBio);
});

