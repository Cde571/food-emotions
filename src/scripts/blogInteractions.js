// blogInteractions.js

// Manejar el envío de un comentario
document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    
    if (commentForm) {
      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const commentText = commentForm.querySelector('textarea').value;
        if (!commentText.trim()) return;
  
        try {
          // Aquí enviarías el comentario al servidor (API)
          // const response = await fetch('/api/comments', { 
          //   method: 'POST', 
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ comment: commentText })
          // });
          // const data = await response.json();
  
          // Para este ejemplo, agregaremos el comentario directamente
          const newComment = document.createElement('li');
          newComment.textContent = commentText;
          commentList.appendChild(newComment);
  
          // Limpiar el formulario
          commentForm.reset();
        } catch (error) {
          console.error("Error al enviar el comentario:", error);
          alert("Hubo un error al enviar tu comentario. Inténtalo nuevamente.");
        }
      });
    }
  
    // Manejar las reacciones
    const reactionButtons = document.querySelectorAll('.reaction-bar button');
    reactionButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const reaction = button.textContent;
  
        try {
          // Aquí enviarías la reacción al servidor
          // const response = await fetch('/api/reactions', { 
          //   method: 'POST', 
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ reaction })
          // });
  
          // Simulación de cambio en el botón para mostrar que fue enviado
          button.textContent = `${reaction} ✅`;
          setTimeout(() => button.textContent = reaction, 1000);
        } catch (error) {
          console.error("Error al registrar la reacción:", error);
        }
      });
    });
  
    // Manejar el formulario de contribución
    const contributeForm = document.querySelector('#contribute-form');
    if (contributeForm) {
      contributeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const title = contributeForm.querySelector('#title').value;
        const content = contributeForm.querySelector('#content').value;
        
        if (!title.trim() || !content.trim()) {
          alert("Por favor completa todos los campos.");
          return;
        }
  
        try {
          // Enviar la nueva publicación al servidor (API)
          // const response = await fetch('/api/posts', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ title, content })
          // });
          // const data = await response.json();
  
          // Redirigir o confirmar el envío
          alert("¡Tu contribución fue enviada!");
          contributeForm.reset();
        } catch (error) {
          console.error("Error al enviar la contribución:", error);
          alert("Hubo un problema al enviar tu contribución. Inténtalo nuevamente.");
        }
      });
    }
  });
  