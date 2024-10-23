// public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorMessageElement = document.querySelector('.error-message');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorMessageElement.textContent = ''; // Limpiar mensaje de error
  
      const formData = new FormData(form);
      const data = {
        username: formData.get('username'),
        password: formData.get('password'),
      };
  
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include', // Permitir cookies de sesión
        });
  
        if (!response.ok) {
          const responseData = await response.json();
          errorMessageElement.textContent = responseData.message || 'Error al iniciar sesión';
          return;
        }
  
        // Redirigir al perfil del usuario
        window.location.href = '/profile';
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        errorMessageElement.textContent = 'Error en el inicio de sesión';
      }
    });
  });
  