// src/scripts/fetchUserData.js

// Función para obtener los datos del usuario
async function fetchUserData() {
    try {
      const response = await fetch('http://localhost:3000/profile-data', {
        method: 'GET',
        credentials: 'include', // Importante para enviar cookies de sesión
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          // Si el usuario no está autorizado, redirigir al formulario de inicio de sesión
          window.location.href = '/login';
        } else {
          throw new Error(`Error al obtener datos del perfil: ${response.statusText}`);
        }
      }
  
      const userData = await response.json(); // Asignar los datos al objeto userData
  
      // Verificar si los elementos existen antes de actualizarlos
      const userNameElement = document.querySelector('#user-name');
      const userStatusElement = document.querySelector('#user-status');
      const profilePicElement = document.querySelector('#profile-pic');
      const bioDescriptionElement = document.querySelector('#bio-description');
  
      if (userNameElement) {
        userNameElement.textContent = userData.userName;
      }
      if (userStatusElement) {
        userStatusElement.textContent = userData.status;
      }
      if (profilePicElement) {
        profilePicElement.src = userData.profilePic;
      }
      if (bioDescriptionElement) {
        bioDescriptionElement.textContent = userData.bio || 'Descripción no disponible';
      }
  
    } catch (err) {
      const error = err.message; // Capturar el mensaje de error
      console.error('Error al obtener los datos del perfil:', error);
      
      const errorMessageElement = document.querySelector('#error-message');
      if (errorMessageElement) {
        errorMessageElement.textContent = error;
      }
    }
  }
  
  // Función para cerrar sesión
  async function logout() {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include', // Importante para enviar cookies de sesión
      });
  
      if (!response.ok) {
        throw new Error(`Error al cerrar sesión: ${response.statusText}`);
      }
  
      // Redirigir a la página de inicio de sesión después de cerrar sesión
      window.location.href = '/';
    } catch (err) {
      console.error('Error al cerrar sesión:', err.message);
      const errorMessageElement = document.querySelector('#error-message');
      if (errorMessageElement) {
        errorMessageElement.textContent = 'Error al cerrar sesión. Por favor, inténtelo de nuevo.';
      }
    }
  }
  
  // Inicializar eventos cuando el DOM esté cargado
  document.addEventListener('DOMContentLoaded', () => {
    // Obtener los datos del usuario cuando la página cargue
    fetchUserData();
  
    // Agregar un evento al botón de cerrar sesión
    const logoutButton = document.querySelector('#logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', logout);
    }
  });
  