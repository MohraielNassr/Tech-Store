// Variables
let allProducts = [];
let currentCategory = "all";

// DOM Elements
const productsGrid = document.getElementById("products-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
const cartBadge = document.getElementById("cart-badge");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCartBadge();
  setupFilterListeners();
  setupHamburgerMenu();
  updateLoginButton();
});

// Load products from JSON
function loadProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "./brands.json");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      allProducts = JSON.parse(xhr.responseText);
      displayProducts(allProducts);
    }
  };
}

// Display products
function displayProducts(products) {
  productsGrid.innerHTML = "";

  if (products.length === 0) {
    productsGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b4f3a;">No products found</p>';
    return;
  }

  products.forEach((product) => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${product.price} EGP</span>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;

  // Click on image to go to product details
  card.querySelector(".product-image").onclick = () => {
    window.location.href = `prdDetails.html?id=${product.id}`;
  };

  return card;
}

// Filter products by category
function filterByCategory(category) {
  currentCategory = category;

  if (category === "all") {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(
      (product) => product.category === category,
    );
    displayProducts(filtered);
  }
}

// Setup filter listeners
function setupFilterListeners() {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterByCategory(btn.dataset.category);
    });
  });
}

// Add to cart
function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  // Check if user is logged in
  const loggedUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!loggedUser) {
    localStorage.setItem("pendingProduct", JSON.stringify(product));
    alert("Please login to continue 🛒");
    setTimeout(() => {
      window.location.href = "logIn.html";
    }, 500);
    return;
  }

  // Add to cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  alert("Product added to cart 🛒");
}

// Update cart badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartBadge.textContent = totalItems;
}

// Setup hamburger menu
function setupHamburgerMenu() {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Close menu when link is clicked
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

// Update login/logout button
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

// Logout function
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart");
  window.location.href = "./index.html";
}

// Handle newsletter form
function handleNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  alert(
    `Thank you for subscribing! A confirmation email has been sent to ${email}`,
  );
  e.target.reset();
}

// Update cart badge on page load and when cart changes
window.addEventListener("storage", updateCartBadge);
