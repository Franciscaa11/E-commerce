// Fetch products from the API
const apiURL = "https://fakestoreapi.com/products";

// Fetch and display featured products on the landing page
fetch(apiURL)
  .then((response) => response.json())
  .then((products) => {
    displayFeaturedProducts(products);
  })
  .catch((error) => console.error("Error fetching products:", error));

// Function to display featured products on the landing page
function displayFeaturedProducts(products) {
  const featuredProductsContainer =
    document.getElementById("featured-products");
  featuredProductsContainer.innerHTML = "";

  // Display the first six products as featured
  const featuredProducts = products.slice(0, 6);

  featuredProducts.forEach((product) => {
    const productCard = `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">$${product.price}</p>
                        
                    </div>
                </div>
            </div>
        `;
    featuredProductsContainer.innerHTML += productCard;
  });
}

function fetchProductsByCategory(category) {
  return fetch(`${apiURL}/category/${category}`)
    .then((response) => response.json())
    .then((products) => products.slice(0, 4)) // Limiting to 4 products per category
    .catch((error) =>
      console.error(`Error fetching ${category} products:`, error)
    );
}

function displayCategoryProducts(category, products) {
  const categoryContainer = document.createElement("div");
  categoryContainer.classList.add("category-section", "mb-5");

  const categoryTitle = document.createElement("h2");
  categoryTitle.classList.add("text-center", "mb-4");
  categoryTitle.innerText =
    category.charAt(0).toUpperCase() + category.slice(1);

  const row = document.createElement("div");
  row.classList.add("row", "g-3");

  products.forEach((product) => {
    const col = document.createElement("div");
    col.classList.add("col-md-3", "col-sm-6");

    const card = document.createElement("div");
    card.classList.add("card", "h-100", "text-center");

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    img.classList.add("card-img-top", "img-fluid");
    img.style.height = "200px";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerText = product.title;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.innerText = `$${product.price}`;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
  });

  categoryContainer.appendChild(categoryTitle);
  categoryContainer.appendChild(row);
  document
    .getElementById("categories-container")
    .appendChild(categoryContainer);
}

document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
  ];

  categories.forEach((category) => {
    fetchProductsByCategory(category).then((products) => {
      displayCategoryProducts(category, products);
    });
  });
});

function displayAllProductImages() {
  fetch(apiURL)
    .then((response) => response.json())
    .then((products) => {
      const productImagesContainer = document.getElementById("product-images");
      let productHTML = "";

      products.forEach((product) => {
        productHTML += `
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100">
              <img src="${product.image}" class="card-img-top img-fluid" alt="${
          product.title
        }">
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description.substring(
                  0,
                  60
                )}...</p>
                <p class="card-text"><strong>$${product.price}</strong></p>
                <button class="btn btn-primary add-to-cart" data-id="${
                  product.id
                }">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
      });

      productImagesContainer.innerHTML = `<div class="row">${productHTML}</div>`;

      // Add event listeners to all "Add to Cart" buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          const product = products.find((p) => p.id == productId);
          addToCart(product);
        });
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}

document.addEventListener("DOMContentLoaded", displayAllProductImages);

function addToCart(product) {
  console.log("Added to cart:", product);
}

// Function to add a product to the cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Product added to cart!");
}

// Function to update the cart item count in the header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").innerText = cartCount;
}

// Function to display cart items on the cart page
function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartTotal = document.getElementById("cart-total");

  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItem = `
            <div class="row mb-3">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid" alt="${item.title}">
                </div>
                <div class="col-md-4">
                    <h5>${item.title}</h5>
                </div>
                <div class="col-md-2">
                    <p>$${item.price}</p>
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control" value="${item.quantity}" min="1" data-id="${item.id}" onchange="updateCartItem(this)">
                </div>
                <div class="col-md-2">
                    <button class="btn btn-danger" data-id="${item.id}" onclick="removeCartItem(this)">Remove</button>
                </div>
            </div>
        `;
    cartItemsContainer.innerHTML += cartItem;
  });

  cartSubtotal.innerText = subtotal.toFixed(2);
  cartTotal.innerText = subtotal.toFixed(2);
}

// Function to update the quantity of a cart item
function updateCartItem(inputElement) {
  const productId = inputElement.getAttribute("data-id");
  const newQuantity = parseInt(inputElement.value);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.map((item) => {
    if (item.id === parseInt(productId)) {
      item.quantity = newQuantity;
    }
    return item;
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
}

// Function to remove a cart item
function removeCartItem(buttonElement) {
  const productId = buttonElement.getAttribute("data-id");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter((item) => item.id !== parseInt(productId));

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
  updateCartCount();
}

// Function to handle checkout process (simplified)
function handleCheckout() {
  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Simple checkout validation (you can add more robust validation)
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (name && address && email && phone) {
      alert("Order placed successfully!");
      localStorage.removeItem("cart"); // Clear the cart
      window.location.href = "index.html"; // Redirect to home page
    } else {
      alert("Please fill in all required fields.");
    }
  });
}

// Assuming cart data is stored in local storage with key 'cart'
const cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderOrderSummary() {
  const orderItemsContainer = document.getElementById("order-items");
  let total = 0;

  cart.forEach((item) => {
    const itemElement = document.createElement("p");
    itemElement.textContent = `${item.name} (x${item.quantity})`;
    const priceElement = document.createElement("span");
    priceElement.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
    itemElement.appendChild(priceElement);
    orderItemsContainer.appendChild(itemElement);
    total += item.price * item.quantity;
  });

  // Display the total including shipping
  const shippingCost = 5.0; // Example fixed shipping cost
  total += shippingCost;

  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

function placeOrder() {
  // Simulate placing the order
  alert("Your order has been placed successfully!");

  // Clear the cart
  localStorage.removeItem("cart");

  // Optionally redirect the user to an order confirmation page
}

// Render the order summary on page load
document.addEventListener("DOMContentLoaded", renderOrderSummary);

// On page load, determine which page logic to run
document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop();
  if (page === "index.html") {
    updateCartCount();
  } else if (page === "product.html") {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    displayProductDetails(productId);
    updateCartCount();
  } else if (page === "cart.html") {
    displayCartItems();
    updateCartCount();
  } else if (page === "checkout.html") {
    displayCartItems();
    handleCheckout();
  }
});
