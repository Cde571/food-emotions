document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;
  
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userInput }),
      });
  
      const data = await response.json();
      document.getElementById('bot-response').textContent = data.answer;
  
    } catch (error) {
      console.error('Error en la comunicación con el bot:', error);
      document.getElementById('bot-response').textContent = 'Hubo un error al procesar tu pregunta. Intenta de nuevo.';
    }
  });
  