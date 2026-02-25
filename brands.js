var products;
const Container = document.getElementById("products-container");
const searchInput = document.getElementById("searchInput");
const brandCheckboxes = document.getElementsByClassName("brand-filter");
const applyBtn = document.getElementById("apply-btn");
const resetBtn = document.getElementById("reset-btn");
const cartBadge = document.getElementById("cartCount");

// Update login/logout button on page load
document.addEventListener("DOMContentLoaded", () => {
  updateLoginButton();
  updateCartBadge();
  window.addEventListener("storage", updateLoginButton);
  window.addEventListener("storage", updateCartBadge);
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
  window.location.href = "./index.html";
}

function renderProducts(productsList) {
  Container.innerHTML = "";
  for (let product of productsList) {
    // <-- let مهم هنا
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.className = "img";
    img.src = product.image;

    const Name = document.createElement("h4");
    Name.innerHTML = product.name;

    const Price = document.createElement("p");
    Price.innerHTML = product.price + " EGP";

    const btn = document.createElement("button");
    btn.innerHTML = "Add to Cart";

    card.appendChild(img);
    card.appendChild(Name);
    card.appendChild(Price);
    card.appendChild(btn);
    Container.appendChild(card);

    const pid = product.id;
    img.onclick = function () {
      window.location.href = "prdDetails.html?id=" + pid;
    };

    btn.onclick = function () {
      addToCart(product);
    };
  }
}

// Load products from JSON
const xhr = new XMLHttpRequest();
xhr.open("GET", "./brands.json");
xhr.send();
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    products = JSON.parse(xhr.responseText);
    renderProducts(products);
  }
};

// Add to cart function
function addToCart(product) {
  const loggedUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!loggedUser) {
    localStorage.setItem("pendingProduct", JSON.stringify(product));
    alert("Please login to continue 🛒");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 500);
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((item) => item.id === product.id);

  if (existing) existing.quantity += 1;
  else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  
  alert("Product added to cart 🛒");
  updateCartBadge();
}
// Update cart badge 
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartBadge.textContent = totalItems;
}
// Filters
applyBtn.onclick = function () {
  const searchValue = searchInput.value.toLowerCase();
  const selectedBrands = [];

  for (let i = 0; i < brandCheckboxes.length; i++) {
    if (brandCheckboxes[i].checked)
      selectedBrands.push(brandCheckboxes[i].value);
  }

  const result = products.filter((product) => {
    const matchName = product.name.toLowerCase().includes(searchValue);
    const matchBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.category);
    return matchName && matchBrand;
  });

  renderProducts(result);
};

resetBtn.onclick = function () {
  searchInput.value = "";
  for (let i = 0; i < brandCheckboxes.length; i++)
    brandCheckboxes[i].checked = false;
  renderProducts(products);
};
