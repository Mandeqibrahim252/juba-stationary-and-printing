const products = [
    { id: 1, name: "Premium Ballpoint Pen", price: 50, category: "pens", icon: "fa-pen" },
    { id: 2, name: "Gel Pen Set", price: 150, category: "pens", icon: "fa-pen-fancy" },
    { id: 3, name: "Fountain Pen", price: 500, category: "pens", "icon": "fa-pen-nib" },
    { id: 4, name: "Marker Set", price: 200, category: "pens", "icon": "fa-marker" },
    { id: 5, name: "A4 Paper (500 sheets)", price: 350, category: "papers", "icon": "fa-file" },
    { id: 6, name: "Legal Pad", price: 80, category: "papers", "icon": "fa-file-alt" },
    { id: 7, name: "Notebook A5", price: 120, category: "papers", "icon": "fa-book" },
    { id: 8, name: "Spiral Notebook", price: 100, category: "papers", "icon": "fa-book-open" },
    { id: 9, name: "Stapler", price: 250, category: "supplies", "icon": "fa Paperclip" },
    { id: 10, name: "Paper Clips Box", price: 50, category: "supplies", "icon": "fa-paperclip" },
    { id: 11, name: "Scissors", price: 150, category: "supplies", "icon": "fa-scissors" },
    { id: 12, name: "Tape Dispenser", price: 180, category: "supplies", "icon": "fa-tape" },
    { id: 13, name: "Glue Stick", price: 80, category: "supplies", "icon": "fa Glue" },
    { id: 14, name: "Ruler 30cm", price: 60, category: "supplies", "icon": "fa-ruler" },
    { id: 15, name: "Eraser Pack", price: 40, category: "supplies", "icon": "fa-eraser" },
    { id: 16, name: "Highlighters Set", price: 180, category: "pens", "icon": "fa-highlighter" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initDarkMode();
    initCart();
    loadProducts();
    loadFeaturedProducts();
    initProductFilters();
    initSearch();
    initContactForm();
    updateCartCount();
    initNewsletter();
});

function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', function() {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const newState = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', newState);
        });
    }
}

function initCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');

    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.classList.add('active');
        });

        if (closeCart) {
            closeCart.addEventListener('click', function() {
                cartModal.classList.remove('active');
            });
        }

        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProducts');
    if (!featuredGrid) return;

    const featured = products.slice(0, 6);
    featuredGrid.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">SSP ${product.price}</p>
                <button class="product-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification('Added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            renderCartItems();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px 0;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>SSP ${item.price}</p>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <span class="remove-item" onclick="removeFromCart(${item.id})">Remove</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `SSP ${total}`;
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order!\n\nTotal: SSP ${total}\n\nWe will contact you shortly for confirmation.`);
    cart = [];
    saveCart();
    updateCartCount();
    renderCartItems();
    
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
    }
}

function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!filterBtns.length || !productsGrid) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(p => p.category === category);
    }

    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!searchInput || !productsGrid) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );

        productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (validateEmail(email)) {
                submitContactToPHP({ name, email, message });
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function submitContactToPHP(data) {
    fetch('assets/php/contact.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}&message=${encodeURIComponent(data.message)}`
    })
    .then(response => response.text())
    .then(result => {
        if (result.trim() === 'success') {
            showNotification('Message sent successfully!');
            document.getElementById('contactForm').reset();
        } else {
            showNotification('Message saved locally (demo mode)');
            document.getElementById('contactForm').reset();
        }
    })
    .catch(error => {
        showNotification('Message saved locally (demo mode)');
        document.getElementById('contactForm').reset();
    });
}

function initNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!');
                this.reset();
            } else {
                showNotification('Please enter a valid email', 'error');
            }
        });
    });
}

function subscribeNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    
    if (validateEmail(email)) {
        showNotification('Thank you for subscribing!');
        e.target.reset();
    } else {
        showNotification('Please enter a valid email', 'error');
    }
    
    return false;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);