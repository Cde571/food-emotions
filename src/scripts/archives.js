// Archivo: src/scripts/archives.js

// Función para mostrar la sección seleccionada y ocultar las demás
function showSection(sectionId) {
    // Oculta todas las secciones
    document.querySelectorAll('.archive-section').forEach((section) => {
      section.classList.add('hidden'); 
    });
    
    // Muestra la sección seleccionada
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.classList.remove('hidden');
    }
  }
  
  // Configurar eventos de clic en los botones de navegación de tabs
  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.archive-tabs button');
    
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Obtener el ID de la sección del botón seleccionado
        const sectionId = tab.getAttribute('data-section');
        // Llamar a la función para mostrar la sección correspondiente
        showSection(sectionId);
        
        // Actualizar la clase activa para el botón de la pestaña
        tabs.forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });
  