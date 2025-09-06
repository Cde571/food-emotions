function filterFavorites() {
  const search = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('category').value;
  const cards = document.querySelectorAll('.favorite-card');

  cards.forEach(card => {
    const title = card.querySelector('h2').innerText.toLowerCase();
    const desc = card.querySelector('p').innerText.toLowerCase();
    const cardCategory = card.getAttribute('data-category');

    const matchesSearch = title.includes(search) || desc.includes(search);
    const matchesCategory = category === 'all' || cardCategory === category;

    card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
  });
}
