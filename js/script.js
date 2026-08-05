document.addEventListener("DOMContentLoaded", () => {
  // Approve/Reject Buttons
 /* document.querySelectorAll(".btn-approve").forEach(btn =>
    btn.addEventListener("click", () => {
      alert("User/Project approved successfully!");
    })
  );

  document.querySelectorAll(".btn-reject").forEach(btn =>
    btn.addEventListener("click", () => {
      alert("User/Project rejected.");
    })
  );*/

  // Delete Buttons
  document.querySelectorAll(".btn-delete").forEach(btn =>
    btn.addEventListener("click", () => {
      const confirmDelete = confirm("Are you sure you want to delete this?");
      if (confirmDelete) {
        alert("Deleted successfully!");
        // You can also remove row from DOM
        // btn.closest("tr").remove();
      }
    })
  );

  // Send Notification
  const notifyForm = document.getElementById("notifyForm");
  if (notifyForm) {
    notifyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("📣 Notification sent to users successfully!");
      notifyForm.reset();
    });
  }

  // Save Settings
  const settingsForm = document.getElementById("settingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("✅ Settings updated successfully.");
    });
  }
});
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  sidebar.classList.toggle("collapsed");

  if (sidebar.classList.contains("collapsed")) {
    content.style.marginLeft = "80px";
  } else {
    content.style.marginLeft = "260px";
  }
}

// Smooth page transition for sidebar + card links (if you added earlier)
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".sidebar a, a.card-link");

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const url = this.getAttribute("href");
      if (!url || url.startsWith("#") || this.target === "_blank") return;

      e.preventDefault();
      document.body.classList.add("page-exit");

      setTimeout(() => {
        window.location.href = url;
      }, 250);
    });
  });
});
