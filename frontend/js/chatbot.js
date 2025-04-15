window.onload = function () {
  fetch("/api/auth/check-login", {
    method: "GET",
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("chat-section").style.display = "block";
        showOptions("start");
      }
    })
    .catch(err => {
      console.error("Login check failed:", err);
    });
};

let userEmail = "";
let isNewUser = true;

function sendOTP() {
  const email = document.getElementById("email").value;
  if (!email) return alert("Please enter your email");

  fetch("/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        userEmail = email;
        isNewUser = data.isNewUser;

        document.getElementById("otp-section").style.display = "block";
        document.getElementById("otp").focus();

        // Hide name and phone for existing users
        document.getElementById("name").style.display = isNewUser ? "block" : "none";
        document.getElementById("phone").style.display = isNewUser ? "block" : "none";

        alert(data.message);
      } else {
        alert(data.message || "Error sending OTP");
      }
    })
    .catch(err => {
      console.error("OTP send error:", err);
      alert("Error sending OTP");
    });
}

function verifyOTP() {
  const otp = document.getElementById("otp").value.trim();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Check if OTP is entered
  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  // If new user, validate name and phone
  if (isNewUser) {
    if (!name || !phone) {
      alert("Please enter name and phone number");
      return;
    }

    const phoneRegex = /^[6-9][0-9]{9}$/; // Validates 10-digit Indian mobile numbers starting with 6-9
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
  }

  // OTP verification API call
  fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userEmail, otp, name, phone }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("chat-section").style.display = "block";
        showOptions("start");
      } else {
        alert(data.message || "Invalid OTP");
      }
    })
    .catch(err => {
      console.error("OTP verify error:", err);
      alert("OTP verification failed");
    });
}


function showOptions(choice) {
  fetch("/chatbot", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ choice }),
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
        throw new Error("Failed to get response from chatbot");
      }
      return res.json();
    })
    .then(data => {
      const chatBox = document.getElementById("chat-box");

      // ✅ Remove previous buttons
      const oldButtons = chatBox.querySelectorAll("button");
      oldButtons.forEach(btn => btn.remove());

      // ✅ Add new bot message
      const message = document.createElement("p");
      message.innerHTML = `<strong>Bot:</strong> ${data.question}`;
      chatBox.appendChild(message);

      // ✅ Add new options as buttons
      data.options?.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.style.margin = "5px";

        // ✅ If option has a link, open it
        if (data.link && data.link[opt]) {
          btn.onclick = () => window.open(data.link[opt], "_blank");
        } else {
          btn.onclick = () => showOptions(opt);
        }

        chatBox.appendChild(btn);
      });

      // ✅ Scroll to latest
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(err => {
      console.error("Chatbot error:", err);
      alert(err.message);
    });
}


function logout() {
  fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    .then(() => location.reload());
}
