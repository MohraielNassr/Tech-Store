// reg.js (simple)

document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const termsChecked = document.getElementById("terms").checked;
  const msg = document.getElementById("msg");

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Basic validation
  if (!fullName || !email || !password || !confirmPassword) {
    msg.textContent = "Please fill in all fields.";
    msg.style.color = "red";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    msg.textContent = "Please enter a valid email.";
    msg.style.color = "red";
    return;
  }

  if (password.length < 6) {
    msg.textContent = "Password must be at least 6 characters.";
    msg.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    msg.textContent = "Passwords do not match.";
    msg.style.color = "red";
    return;
  }

  if (!termsChecked) {
    msg.textContent = "You must accept the terms and conditions.";
    msg.style.color = "red";
    return;
  }

  // Check duplicate email
  const exists = users.find(u => u.email === email);
  if (exists) {
    msg.textContent = "This email is already registered. Please log in.";
    msg.style.color = "red";
    return;
  }

  // Save user
  users.push({ id: Date.now(), fullName, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  msg.textContent = "Account created successfully ✅";
  msg.style.color = "green";

  setTimeout(() => {
    window.location.href = "logIn.html";
  }, 700);
});
