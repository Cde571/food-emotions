document.addEventListener('DOMContentLoaded', () => {
    const viewRecipeButton = document.querySelector('.view-recipe-btn');
    const modal = document.getElementById('recipe-modal');
    const closeModalButton = document.querySelector('.close-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const searchButton = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const categoryDropdown = document.querySelector('.categories-dropdown');
    const recipeItems = document.querySelectorAll('.recipe-item');
    const listCards = document.querySelectorAll('.list-card');
  
    // Función para mostrar el modal
    viewRecipeButton.addEventListener('click', () => {
      modal.classList.add('show');
    });
  
    // Función para cerrar el modal
    closeModalButton.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  
    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('show');
      }
    });
  
    // Función para eliminar recetas de la lista reciente
    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const recipeItem = event.target.closest('.recipe-item');
        recipeItem.remove();
      });
    });
  
    // Función para buscar recetas por nombre
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.toLowerCase();
      recipeItems.forEach(item => {
        const recipeName = item.querySelector('.recipe-img').alt.toLowerCase();
        item.style.display = recipeName.includes(searchTerm) ? 'block' : 'none';
      });
    });
  
    // Función para filtrar recetas por categoría
    categoryDropdown.addEventListener('change', () => {
      const selectedCategory = categoryDropdown.value;
      listCards.forEach(card => {
        card.style.display = card.dataset.category === selectedCategory || !selectedCategory ? 'block' : 'none';
      });
    });
  });
  // Mostrar el modal de galería
function openGallery() {
    const galleryModal = document.getElementById("gallery-modal");
    galleryModal.classList.add("show");
  }
  
  // Cerrar el modal de galería
  function closeGallery() {
    const galleryModal = document.getElementById("gallery-modal");
    galleryModal.classList.remove("show");
  }
  
  // Agregar evento al botón de "View more" para abrir la galería
  document.querySelector(".view-more").addEventListener("click", openGallery);

  // scripts/recipes.js

function openGalleryModal() {
    document.getElementById("gallery-modal").classList.add("show");
  }
  
  function closeGalleryModal() {
    document.getElementById("gallery-modal").classList.remove("show");
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const viewMoreButton = document.querySelector(".view-more");
    if (viewMoreButton) {
      viewMoreButton.addEventListener("click", openGalleryModal);
    }
  
    const closeGalleryButton = document.querySelector(".close-gallery-btn");
    if (closeGalleryButton) {
      closeGalleryButton.addEventListener("click", closeGalleryModal);
    }
  });
  
  