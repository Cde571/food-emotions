// ============================================================
// 🔹 Cargar datos del usuario
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/profile-data', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) window.location.href = '/login';
      throw new Error('Error al obtener los datos del perfil.');
    }

    const userData = await response.json();

    // Rellenar campos con datos del backend
    document.getElementById('name').value = userData.userName || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.querySelector('.profile-pic').src = userData.profilePic || 'src/img/Image (4).png';
  } catch (err) {
    console.error('Error al cargar el perfil:', err.message);
  }
});

// ============================================================
// 🔹 Guardar cambios en el perfil
// ============================================================
document.querySelector('.profile-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  try {
    const response = await fetch('http://localhost:3000/profile/update', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, telefono: phone }),
    });

    if (!response.ok) throw new Error('Error al guardar los cambios.');
    alert('✅ Perfil actualizado correctamente.');
  } catch (err) {
    console.error('Error al actualizar el perfil:', err.message);
    alert('❌ Error al guardar los cambios.');
  }
});
