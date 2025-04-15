function adminLogin() {
    const id = document.getElementById("admin-id").value;
    const password = document.getElementById("admin-password").value;
  
    fetch("/api/admin/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          location.href = "admin-dashboard.html";
        } else {
          document.getElementById("error-msg").textContent = data.message;
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        document.getElementById("error-msg").textContent = "Server error";
      });
  }
  