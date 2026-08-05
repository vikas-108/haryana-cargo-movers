function loadSidebar(activePage) {
  fetch("component/sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;

      // Highlight active menu
      document
        .querySelectorAll(".sidebar a")
        .forEach(link => {
          if (link.dataset.page === activePage) {
            link.classList.add("active");
          }
        });
    });
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
