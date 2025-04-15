window.onload = function () {
    fetchUsers();
  };
  
  function fetchUsers() {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const tbody = document.querySelector("#user-table tbody");
          tbody.innerHTML = ""; // clear previous rows
  
          data.users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td contenteditable="true" data-field="name">${user.name || ""}</td>
              <td>${user.email}</td>
              <td contenteditable="true" data-field="phone">${user.phone || ""}</td>
              <td>
                <button onclick="updateUser('${user._id}', this)">Update</button>
                <button onclick="deleteUser('${user._id}')">Delete</button>
              </td>
            `;
            tbody.appendChild(row);
          });
        } else {
          alert("Failed to load users.");
        }
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        alert("Error fetching user data.");
      });
  }
  
  function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("User deleted.");
            fetchUsers();
          } else {
            alert("Failed to delete user.");
          }
        })
        .catch(err => {
          console.error("Delete error:", err);
          alert("Error deleting user.");
        });
    }
  }
  
  function updateUser(id, btn) {
    const row = btn.closest("tr");
    const name = row.querySelector('[data-field="name"]').innerText.trim();
    const phone = row.querySelector('[data-field="phone"]').innerText.trim();
  
    // ✅ Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
  
    fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("User updated successfully.");
          fetchUsers();
        } else {
          alert("Failed to update user.");
        }
      })
      .catch(err => {
        console.error("Update error:", err);
        alert("Error updating user.");
      });
  }
  
  