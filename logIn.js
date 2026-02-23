// logIn.js - Login functionality

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document
        .getElementById("loginEmail")
        .value.trim()
        .toLowerCase();
      const password = document.getElementById("loginPassword").value;
      const msg = document.getElementById("msg");

      // get users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // find the user
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!email || !password) {
        msg.textContent = "Please enter email and password.";
        msg.classList.remove("success");
        msg.classList.add("error");
        return;
      }

      if (!user) {
        msg.textContent = "Invalid email or password.";
        msg.classList.remove("success");
        msg.classList.add("error");
        return;
      }

      // save current user
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        }),
      );

      msg.textContent = "Login successful ✅";
      msg.classList.remove("error");
      msg.classList.add("success");

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 600);
    });
  }
});

// Logout function
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "./index.html";
}
