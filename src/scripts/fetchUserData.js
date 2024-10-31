// Función para obtener los datos del usuario
async function fetchUserData() {
  try {
    const response = await fetch('http://localhost:3000/profile-data', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
      } else {
        throw new Error(`Error al obtener datos del perfil: ${response.statusText}`);
      }
    }

    const userData = await response.json();

    // Actualizar el contenido en el DOM solo si los elementos existen
    const userNameElement = document.querySelector('#user-name');
    if (userNameElement) userNameElement.textContent = userData.userName || 'Usuario';

    const userStatusElement = document.querySelector('#user-status');
    if (userStatusElement) userStatusElement.textContent = userData.status || '';

    const teamUserNameElement = document.querySelector('.team h3');
    if (teamUserNameElement) teamUserNameElement.textContent = `${userData.userName} appears in this team`;

    const profilePicElement = document.querySelector('#profile-pic');
    if (profilePicElement) profilePicElement.src = userData.profilePic || 'src/img/Image (4).png';

    const bioDescriptionElement = document.querySelector('#bio-description');
    if (bioDescriptionElement) bioDescriptionElement.textContent = userData.bio || 'Descripción no disponible';

  } catch (err) {
    console.error('Error al obtener los datos del perfil:', err.message);
    const errorMessageElement = document.querySelector('#error-message');
    if (errorMessageElement) errorMessageElement.textContent = err.message;
  }
}


// Función para cerrar sesión
async function logout() {
  try {
    const response = await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al cerrar sesión: ${response.statusText}`);
    }

    window.location.href = '/';
  } catch (err) {
    console.error('Error al cerrar sesión:', err.message);
    const errorMessageElement = document.querySelector('#error-message');
    if (errorMessageElement) errorMessageElement.textContent = 'Error al cerrar sesión. Inténtelo de nuevo.';
  }
}

// Cambiar estado entre Online y Ausente
async function handleStatusChange(event) {
  const status = event.target.value;
  try {
    const response = await fetch('http://localhost:3000/update-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      console.error('Error al actualizar el estado:', await response.json());
    }
  } catch (error) {
    console.error('Error en la solicitud de estado:', error);
  }
}

// Alternar botón Follow/Unfollow
let isFollowing = true;
function toggleFollow() {
  const button = document.getElementById('follow-button');
  if (button) {
    isFollowing = !isFollowing;
    button.textContent = isFollowing ? 'Unfollow' : 'Follow';
  }
}

// Guardar biografía actualizada
async function saveBio() {
  const bioElement = document.getElementById('bio-editor');
  if (bioElement) {
    const bio = bioElement.value;
    try {
      const response = await fetch('http://localhost:3000/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bio })
      });
      if (!response.ok) {
        console.error('Error al actualizar la biografía:', await response.json());
      } else {
        alert('Biografía actualizada');
      }
    } catch (error) {
      console.error('Error en la solicitud de biografía:', error);
    }
  }
}

// Abrir modales y cargar datos (seguidores o likes)
async function openModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    modalElement.classList.remove('hidden');
    try {
      const endpoint = modalId === 'followersModal' ? '/followers' : '/likes';
      const response = await fetch(`http://localhost:3000${endpoint}`, { credentials: 'include' });
      const data = await response.json();
      const listElement = document.getElementById(modalId === 'followersModal' ? 'followersList' : 'likesList');
      if (listElement) listElement.innerHTML = data.map(item => `<li>${item.username}</li>`).join('');
    } catch (error) {
      console.error(`Error al obtener datos para ${modalId}:`, error);
    }
  }
}

function closeModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) modalElement.classList.add('hidden');
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
  fetchUserData();

  const logoutButton = document.querySelector('#logout-button');
  if (logoutButton) logoutButton.addEventListener('click', logout);

  const statusSelect = document.querySelector('#status-select');
  if (statusSelect) statusSelect.addEventListener('change', handleStatusChange);

  const followButton = document.querySelector('#follow-button');
  if (followButton) followButton.addEventListener('click', toggleFollow);

  const bioEditor = document.querySelector('#bio-editor');
  if (bioEditor) bioEditor.addEventListener('blur', saveBio);
});
