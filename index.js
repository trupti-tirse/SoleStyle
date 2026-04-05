// script.js - SneakerHub Shoes Shopping Website JavaScript

// Product Data
const products = [
    { 
        id: 1, 
        name: 'Nike Air Max 90', 
        price: 129.99, 
        emoji: '👟',
        category: 'Running',
        stock: 15
    },
    { 
        id: 2, 
        name: 'Adidas Yeezy Boost 350', 
        price: 219.99, 
        emoji: '🥾',
        category: 'Lifestyle',
        stock: 8
    },
    { 
        id: 3, 
        name: 'Nike Dunk Low', 
        price: 109.99, 
        emoji: '👞',
        category: 'Casual',
        stock: 22
    },
    { 
        id: 4, 
        name: 'Jordan 1 High', 
        price: 179.99, 
        emoji: '🔥',
        category: 'Basketball',
        stock: 12
    },
    { 
        id: 5, 
        name: 'Adidas Ultraboost 22', 
        price: 189.99, 
        emoji: '⚡',
        category: 'Running',
        stock: 18
    },
    { 
        id: 6, 
        name: 'Vans Old Skool', 
        price: 69.99, 
        emoji: '🛹',
        category: 'Skate',
        stock: 30
    },
    { 
        id: 7, 
        name: 'New Balance 550', 
        price: 149.99, 
        emoji: '🏃‍♂️',
        category: 'Lifestyle',
        stock: 25
    },
    { 
        id: 8, 
        name: 'Puma RS-X', 
        price: 99.99, 
        emoji: '🚀',
        category: 'Casual',
        stock: 20
    }
];

// Cart Data
let cart = [];
let isProcessing = false;

// DOM Elements
const elements = {
    productsGrid: document.getElementById('productsGrid'),
    cartCount: document.getElementById('cartCount'),
    cartModal: document.getElementById('cartModal'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    notification: document.getElementById('notification')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    loadCartFromStorage();
});

// Event Listeners
function setupEventListeners() {
    // Close modal on outside click
    window.onclick = function(event) {
        if (event.target === elements.cartModal) {
            toggleCart();
        }
    };

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.product-card, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// Render Products
function renderProducts() {
    elements.productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})" 
                        id="add-${product.id}">
                    <span class="button-text">Add to Cart</span>
                    <span class="loading" style="display: none;"></span>
                </button>
                <div class="stock-info">${product.stock} in stock</div>
            </div>
        </div>
    `).join('');

    // Add stagger animation
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Add to Cart
async function addToCart(productId) {
    if (isProcessing) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const button = document.getElementById(`add-${productId}`);
    const buttonText = button.querySelector('.button-text');
    const loading = button.querySelector('.loading');

    try {
        isProcessing = true;
        button.disabled = true;
        buttonText.style.display = 'none';
        loading.style.display = 'inline-block';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            if (cartItem.quantity >= product.stock) {
                throw new Error('Out of stock!');
            }
            cartItem.quantity += 1;
        } else {
            if (product.stock === 0) {
                throw new Error('Out of stock!');
            }
            cart.push({ ...product, quantity: 1 });
        }

        saveCartToStorage();
        updateCartUI();
        showNotification('✅ Item added to cart!', 'success');

    } catch (error) {
        showNotification(`❌ ${error.message}`, 'error');
    } finally {
        isProcessing = false;
        button.disabled = false;
        buttonText.style.display = 'inline';
        loading.style.display = 'none';
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    renderCart();
    updateCartUI();
    showNotification('🗑️ Item removed from cart', 'info');
}

// Update Cart Count
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    elements.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Toggle Cart Modal
function toggleCart() {
    elements.cartModal.style.display = elements.cartModal.style.display === 'block' ? 'none' : 'block';
    if (elements.cartModal.style.display === 'block') {
        renderCart();
    }
}

// Render Cart Items
function renderCart() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
                <a href="#products" class="cta-button" style="margin-top: 1rem; display: inline-block;">
                    Start Shopping
                </a>
            </div>
        `;
    } else {
        elements.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 0.3rem;">${item.name}</div>
                    <div style="color: #666; font-size: 0.9rem;">$${item.price.toFixed(2)} × ${item.quantity}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="font-weight: bold; color: #ff6b6b;">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    elements.cartTotal.textContent = total.toFixed(2);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('❌ Your cart is empty!', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simulate checkout process
    showNotification('🔄 Processing your order...', 'info');
    
    setTimeout(() => {
        showNotification(`🎉 Thank you for your purchase! Total: $${total.toFixed(2)}`, 'success');
        cart = [];
        saveCartToStorage();
        updateCartUI();
        toggleCart();
    }, 1500);
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = elements.notification;
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show', type);
    }, 4000);
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('sneakerhub_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('sneakerhub_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Search Functionality
function searchProducts(query) {
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filtered);
}

// Filter by Category
function filterByCategory(category) {
    const filtered = category === 'all' 
        ? products 
        : products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    renderProducts(filtered);
}

// Quantity Controls (for future enhancement)
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0 && newQuantity <= item.stock) {
            item.quantity = newQuantity;
            saveCartToStorage();
            renderCart();
            updateCartUI();
        }
    }
}

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.updateQuantity = updateQuantity;
window.searchProducts = searchProducts;
window.filterByCategory = filterByCategory;

// Performance: Preload critical resources
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}

// PWA Ready - Add to home screen prompt (optional)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});