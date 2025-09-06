export function openModal(id) {
    const modal = document.getElementById(id);
    const content = modal.querySelector('[data-modal-content]');
    modal.classList.remove('hidden');
    setTimeout(() => {
      content.classList.remove('scale-90', 'opacity-0');
      content.classList.add('scale-100', 'opacity-100');
    }, 10);
  }
  
  export function closeModal(id) {
    const modal = document.getElementById(id);
    const content = modal.querySelector('[data-modal-content]');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-90', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }
  