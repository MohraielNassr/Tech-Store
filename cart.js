var cartContainer = document.getElementById("cartContainer");
var totalPriceEl = document.getElementById("totalPrice");
var cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update login/logout button on page load
document.addEventListener("DOMContentLoaded", () => {
  updateLoginButton();
  window.addEventListener("storage", updateLoginButton);
});

function updateLoginButton() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const loginLink = document.querySelector(".btn-login");

  if (currentUser && loginLink) {
    loginLink.textContent = `Logout (${currentUser.fullName})`;
    loginLink.href = "javascript:void(0);";
    loginLink.onclick = () => {
      if (confirm("Are you sure you want to logout?")) {
        logout();
      }
    };
  } else if (loginLink) {
    loginLink.textContent = "Login";
    loginLink.href = "logIn.html";
    loginLink.onclick = null;
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart");
  window.location.href = "./index.html";
}

function renderCart() {
  cartContainer.innerHTML = "";
  var total = 0;
  if (cart.length === 0) {
    cartContainer.innerHTML =
      "<p style='text-align: center; padding: 40px; color: #6b4f3a; font-size: 18px;'>Your cart is empty 😢</p>";
    totalPriceEl.textContent = "";
    return;
  }

  for (let item of cart) {
    var div = document.createElement("div");
    div.className = "cart-item";

    var img = document.createElement("img");
    img.src = item.image;

    var infoDiv = document.createElement("div");
    infoDiv.className = "cart-item-info";

    var name = document.createElement("h4");
    name.textContent = item.name;

    var price = document.createElement("p");
    price.textContent = "Price: " + item.price + " EGP";

    var qty = document.createElement("p");
    qty.textContent = "Quantity: " + item.quantity;

    infoDiv.append(name, price, qty);

    var controlsDiv = document.createElement("div");
    controlsDiv.className = "cart-item-controls";

    var plusBtn = document.createElement("button");
    plusBtn.textContent = "+ Add";
    plusBtn.onclick = () => increaseQty(item.id);

    var minusBtn = document.createElement("button");
    minusBtn.textContent = "- Remove One";
    minusBtn.onclick = () => decreaseQty(item.id);

    var removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove All";
    removeBtn.onclick = () => removeItem(item.id);

    controlsDiv.append(plusBtn, minusBtn, removeBtn);
    div.append(img, infoDiv, controlsDiv);
    cartContainer.appendChild(div);

    total += item.price * item.quantity;
  }
  totalPriceEl.textContent = "Total: " + total + " EGP";

  // Update cart badge
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = totalItems;
}

function increaseQty(id) {
  let item = cart.find((i) => i.id === id);
  if (item) item.quantity++;
  updateCart();
}

function decreaseQty(id) {
  let item = cart.find((i) => i.id === id);
  if (item && item.quantity > 1) item.quantity--;
  updateCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCart();
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Checkout completed 🎉 Thank you for your purchase!");
  localStorage.removeItem("cart");
  cart = [];
  renderCart();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

renderCart();
