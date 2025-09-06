document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const bookItems = document.querySelectorAll(".book-item");
  
    searchInput.addEventListener("input", function () {
      const filter = searchInput.value.toLowerCase();
  
      bookItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
  