/* ===================================
   SWAP BELT - JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initColorSelection();
    initCart();
    initNewsletterForm();
    initScrollAnimations();
});

/* ===================================
   MOBILE MENU
   =================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    
    if (!mobileMenuBtn) return;
    
    // Create mobile menu overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-content">
            <ul class="mobile-nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#shop">Shop</a></li>
            </ul>
            <a href="#shop" class="btn btn-primary btn-full mobile-shop-btn">Shop Now</a>
        </div>
    `;
    document.body.appendChild(mobileMenu);
    
    // Add mobile menu styles dynamically
    const mobileMenuStyles = document.createElement('style');
    mobileMenuStyles.textContent = `
        .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(250, 250, 248, 0.98);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .mobile-menu.active {
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-menu-content {
            text-align: center;
            padding: 2rem;
        }
        
        .mobile-nav-links {
            list-style: none;
            padding: 0;
            margin: 0 0 2rem 0;
        }
        
        .mobile-nav-links li {
            margin-bottom: 1.5rem;
        }
        
        .mobile-nav-links a {
            font-size: 1.5rem;
            font-weight: 500;
            color: #1a1a1a;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        
        .mobile-nav-links a:hover {
            color: #a68542;
        }
        
        .mobile-shop-btn {
            max-width: 200px;
            margin: 0 auto;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(mobileMenuStyles);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   NAVBAR SCROLL EFFECT
   =================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

/* ===================================
   COLOR SELECTION
   =================================== */
function initColorSelection() {
    const colorDots = document.querySelectorAll('.color-dot');
    
    colorDots.forEach(dot => {
        dot.addEventListener('click', function() {
            // Remove active state from siblings
            this.parentElement.querySelectorAll('.color-dot').forEach(d => {
                d.style.transform = 'scale(1)';
                d.style.boxShadow = 'none';
            });
            
            // Add active state to clicked dot
            this.style.transform = 'scale(1.2)';
            this.style.boxShadow = '0 0 0 2px #fff, 0 0 0 4px #1a1a1a';
        });
    });
}

/* ===================================
   SHOPPING CART
   =================================== */
function initCart() {
    const cart = {
        items: [],
        
        add(product) {
            const existingItem = this.items.find(item => 
                item.name === product.name && item.color === product.color
            );
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
            
            this.updateUI();
            this.showNotification(`${product.name} added to cart!`);
        },
        
        updateUI() {
            // Update cart count in nav if exists
            let cartCount = document.querySelector('.cart-count');
            if (!cartCount) {
                const navCta = document.querySelector('.nav-cta');
                if (navCta) {
                    cartCount = document.createElement('span');
                    cartCount.className = 'cart-count';
                    cartCount.style.cssText = `
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: #c9a66b;
                        color: #1a1a1a;
                        font-size: 0.75rem;
                        font-weight: 600;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;
                    navCta.style.position = 'relative';
                    navCta.appendChild(cartCount);
                }
            }
            
            if (cartCount) {
                const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        },
        
        showNotification(message) {
            // Remove existing notification
            const existing = document.querySelector('.cart-notification');
            if (existing) existing.remove();
            
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `
                <span class="notification-icon">✓</span>
                <span class="notification-message">${message}</span>
            `;
            notification.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: #1a1a1a;
                color: #fff;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 1001;
                animation: slideInUp 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            `;
            
            // Add animation keyframes
            if (!document.querySelector('#cart-notification-styles')) {
                const styles = document.createElement('style');
                styles.id = 'cart-notification-styles';
                styles.textContent = `
                    @keyframes slideInUp {
                        from {
                            transform: translateY(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    @keyframes fadeOut {
                        to {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                    }
                `;
                document.head.appendChild(styles);
            }
            
            document.body.appendChild(notification);
            
            // Remove after animation
            setTimeout(() => notification.remove(), 3000);
        }
    };
    
    // Add to cart buttons
    document.querySelectorAll('.product-card .btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const priceEl = card.querySelector('.price');
            const price = priceEl ? priceEl.textContent : '$0';
            
            // Get selected color if applicable
            const selectedColor = card.querySelector('.color-dot[style*="scale(1.2)"]');
            const color = selectedColor ? selectedColor.getAttribute('title') : null;
            
            cart.add({ name, price, color });
            
            // Button feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#276749';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
}

/* ===================================
   NEWSLETTER FORM
   =================================== */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = this.querySelector('input[type="email"]');
        const button = this.querySelector('button');
        const email = input.value;
        
        if (!email || !email.includes('@')) {
            input.style.boxShadow = '0 0 0 2px #e53e3e';
            setTimeout(() => input.style.boxShadow = '', 2000);
            return;
        }
        
        // Simulate form submission
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        setTimeout(() => {
            input.value = '';
            button.textContent = 'Subscribed!';
            button.style.backgroundColor = '#276749';
            
            setTimeout(() => {
                button.textContent = 'Subscribe';
                button.style.backgroundColor = '';
                button.disabled = false;
            }, 2000);
        }, 1000);
    });
}

/* ===================================
   SCROLL ANIMATIONS
   =================================== */
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    document.querySelectorAll('.feature-card, .product-card, .testimonial-card').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroImage = hero.querySelector('.hero-image');
            
            if (heroImage && scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
    }
}

/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
