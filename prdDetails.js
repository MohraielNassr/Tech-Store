var CART_KEY = "cart";
var USER_KEY = "currentUser";
var PENDING_KEY = "pendingProduct";

// Update login/logout button on page load
document.addEventListener("DOMContentLoaded", () => {
  updateLoginButton();
  updateCartCount();
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
  window.location.href = "./index.html";
}

function getQueryParam(key) {
  var query = window.location.search.substring(1);
  if (query === "") return null;

  var parts = query.split("&");
  for (var i = 0; i < parts.length; i++) {
    var pair = parts[i].split("=");
    if (pair[0] === key) return pair[1];
  }
  return null;
}

function getCart() {
  var cart = localStorage.getItem(CART_KEY);
  if (cart) return JSON.parse(cart);
  return [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  var cart = getCart();
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].quantity != null) total += cart[i].quantity;
    else if (cart[i].qty != null) total += cart[i].qty;
  }

  var el = document.getElementById("cartCount");
  if (el) el.innerHTML = total;
}

function loadjson(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "./brands.json");
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      callback(data);
    }
  };
}

function findById(products, idValue) {
  for (var i = 0; i < products.length; i++) {
    if (String(products[i].id) === String(idValue)) {
      return products[i];
    }
  }
  return null;
}

function renderThumbs(src) {
  var thumbs = document.getElementById("thumbs");
  if (!thumbs) return;

  thumbs.innerHTML = "";
  for (var i = 0; i < 5; i++) {
    var img = document.createElement("img");
    img.src = src;
    thumbs.appendChild(img);
  }
}

function addSpec(parent, key, value) {
  var div = document.createElement("div");
  div.className = "spec-item";
  div.innerHTML = "<strong>" + key + ":</strong> " + value;
  parent.appendChild(div);
}

function renderSpecs(pro) {
  var grid = document.getElementById("specGrid");
  if (!grid) return;

  grid.innerHTML = "";
  addSpec(grid, "Category", pro.category);
  addSpec(grid, "Price", pro.price + " EGP");
  addSpec(grid, "Name", pro.name);
}

function renderProduct(pro) {
  var title = document.getElementById("title");
  if (title) title.innerHTML = pro.name;

  var desc = document.getElementById("desc");
  if (desc) desc.innerHTML = pro.description;

  var price = document.getElementById("newPrice");
  if (price) price.innerHTML = pro.price + " EGP";

  var bc = document.getElementById("bcName");
  if (bc) bc.innerHTML = pro.name;

  var mainImg = document.getElementById("mainImg");
  if (mainImg) mainImg.src = pro.image;

  renderThumbs(pro.image);
  renderSpecs(pro);
}

function addProductToCart(product) {
  var cart = getCart();

  var existing = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
  updateCartCount();
}

function addToCartWithLoginCheck(product) {
  var loggedUser = JSON.parse(localStorage.getItem(USER_KEY));

  if (!loggedUser) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(product));
    alert("Please login to continue 🛒");

    setTimeout(function () {
      window.location.href = "logIn.html";
    }, 500);

    return;
  }

  addProductToCart(product);

  alert("Product added to cart ");
  setTimeout(function () {
    window.location.href = "cart.html";
  }, 700);
}

function bindAddToCartButton(product) {
  var btn = document.getElementById("addToCartBtn");
  if (!btn) return;

  btn.onclick = function () {
    addToCartWithLoginCheck(product);
  };
}

updateCartCount();

var id = getQueryParam("id");
if (!id) {
  alert("Product ID not found (error 405)");
} else {
  loadjson(function (products) {
    var product = findById(products, id);
    if (!product) {
      alert("Product not found");
      return;
    }

    renderProduct(product);
    bindAddToCartButton(product);
  });
}
