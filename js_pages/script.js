document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    updateBasketCount();
    checkUserLogin();
  
    const currentPage = window.location.pathname;
    if (currentPage.includes("basket.html")) renderBasket();
    if (currentPage.includes("booking.html")) initBookingDate();
});

/* --- 1. NAVIGATION & UI --- */
function initMobileMenu() {
    const burger = document.querySelector(".hamburger");
    const nav = document.querySelector(".nav-links");
    if (burger) {
        burger.onclick = () => {
            nav.classList.toggle("active");
            burger.textContent = nav.classList.contains("active") ? "✕" : "☰";
        };
    }
}

/* --- THE "NO-FAIL" AUTH SYSTEM --- */
const authForm = document.getElementById("login-form");

authForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // 1. Grab the values and clean them (the Mac trim fix)
    const nameInput = document.getElementById("signup-name").value.trim();
    const emailInput = document.getElementById("login-email").value.trim().toLowerCase();

    // 2. Just save/update the user (This is the "VIP List" logic)
    // We don't check if they exist, we just say "You're on the list now!"
    const userData = { name: nameInput, email: emailInput };
    localStorage.setItem("luxeUser", JSON.stringify(userData));

    // 3. Success!
    alert(`Welcome to Luxe Locs & Glow, ${nameInput}! ✨`);
    window.location.href = "../index.html"; 
});

/* --- THE LOGOUT BUTTON --- */
function checkUserLogin() {
    const userData = JSON.parse(localStorage.getItem("luxeUser"));
    const greeting = document.getElementById("user-greeting");
    
    if (greeting && userData) {
        // This puts your name and a pretty Gold Logout button in the nav
        greeting.innerHTML = `
            <span style="margin-right:10px;">Hi, ${userData.name}</span>
            <button id="logout-btn" style="background:none; border:1px solid #D4AF37; color:#D4AF37; cursor:pointer; padding:4px 10px; font-size:11px; border-radius:4px; text-transform:uppercase;">Logout</button>
        `;

        document.getElementById("logout-btn").onclick = () => {
            localStorage.removeItem("luxeUser");
            window.location.href = "../index.html";
        };
    }
}

/* --- 3. BASKET SYSTEM --- */
function addToBasket(name, price) {
    let basket = JSON.parse(localStorage.getItem("luxeBasket")) || [];
    basket.push({ name, price });
    localStorage.setItem("luxeBasket", JSON.stringify(basket));
    updateBasketCount();
    alert(`${name} added to bag!`);
}

function updateBasketCount() {
    const basket = JSON.parse(localStorage.getItem("luxeBasket")) || [];
    document.querySelectorAll(".basket-count").forEach(el => el.textContent = basket.length);
}

/* --- 🛒 THE MASTER CHECKOUT & BASKET LOGIC --- */

// This shows the items on the BASKET page
/* --- BASKET LOOK FIX --- */
function renderBasket() {
    const container = document.getElementById("basket-items-container");
    const subtotalEl = document.getElementById("subtotal");
    const basket = JSON.parse(localStorage.getItem("luxeBasket")) || [];
    if (!container) return;

    if (basket.length === 0) {
        container.innerHTML = "<p class='empty-msg'>Your bag is empty.</p>";
        if (subtotalEl) subtotalEl.textContent = "£0.00";
        return;
    }

    let total = 0;
    // Added 'basket-item' class back so your CSS recognizes it!
    container.innerHTML = basket.map((item) => {
        total += item.price;
        return `
            <div class="basket-item">
                <p class="item-name">${item.name}</p>
                <p class="item-price">£${item.price.toFixed(2)}</p>
            </div>`;
    }).join("");
    if (subtotalEl) subtotalEl.textContent = `£${total.toFixed(2)}`;
}

/* --- CHECKOUT LOOK FIX --- */
function renderCheckoutSummary() {
    const summaryContainer = document.getElementById("summary-items");
    const totalEl = document.getElementById("checkout-total");
    const basket = JSON.parse(localStorage.getItem("luxeBasket")) || [];
    
    if (!summaryContainer || !totalEl) return;

    let subtotal = 0;
    // Added 'summary-item' class back!
    summaryContainer.innerHTML = basket.map(item => {
        subtotal += item.price;
        return `
            <div class="summary-item">
                <span>${item.name}</span>
                <span>£${item.price.toFixed(2)}</span>
            </div>`;
    }).join("");

    const shipping = 3.00;
    const grandTotal = subtotal + shipping;

    totalEl.innerHTML = `
        <div class="total-breakdown">
            <p>Subtotal: <span>£${subtotal.toFixed(2)}</span></p>
            <p>Shipping: <span>£3.00</span></p>
            <h3 class="grand-total">Total: <span>£${grandTotal.toFixed(2)}</span></h3>
        </div>
    `;
}

// This handles the "Complete Purchase" button and CLEARS the basket
const paymentForm = document.getElementById("paymentForm");

paymentForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Success Message
    alert("✨ Thank you for choosing Luxe Locs & Glow! Your order has been placed successfully.");

    // 2. CLEAR THE BASKET (Reset for next time)
    localStorage.removeItem("luxeBasket");

    // 3. Send them back Home
    window.location.href = "../index.html";
});

// Run the basket display
renderBasket();

// Run the checkout summary if we are on the checkout page
if (window.location.pathname.includes("checkout.html")) {
    renderCheckoutSummary();
}

function filterProducts(category, button) {
    // 1. Handle button highlighting
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // 2. Filter the cards
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        // Find the category text inside the card
        const cardCategory = card.querySelector('.category').textContent;

        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block'; // Show
            card.style.opacity = '1';
        } else {
            card.style.display = 'none'; // Hide
        }
    });
}