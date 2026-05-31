/* ===================================
   SWAPBELT - Pre-launch Landing Page
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initWaitlistForms();
    initScrollAnimations();
});

/* ===================================
   MOBILE MENU
   =================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (!mobileMenuBtn) return;

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-content">
            <ul class="mobile-nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#product-preview">Preview</a></li>
                <li><a href="#launch">Launch Plan</a></li>
            </ul>
            <a href="#waitlist" class="btn btn-primary btn-full mobile-shop-btn">Join Waitlist</a>
        </div>
    `;
    document.body.appendChild(mobileMenu);

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
            max-width: 220px;
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

    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.toggle('active');
        this.classList.toggle('active', isOpen);
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
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

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ===================================
   NAVBAR SCROLL EFFECT
   =================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        navbar.style.boxShadow = window.pageYOffset > 50 ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none';
    });
}

/* ===================================
   WAITLIST FORMS
   =================================== */
function initWaitlistForms() {
    document.querySelectorAll('.waitlist-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const input = this.querySelector('input[type="email"]');
            const button = this.querySelector('button');
            const email = input.value.trim();

            if (!email || !email.includes('@')) {
                input.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.35)';
                setTimeout(() => input.style.boxShadow = '', 2000);
                return;
            }

            const originalText = button.textContent;
            button.textContent = 'You\'re on the list!';
            button.disabled = true;
            input.value = '';

            let message = this.parentElement.querySelector('.waitlist-success');
            if (!message) {
                message = document.createElement('p');
                message.className = 'waitlist-success';
                this.insertAdjacentElement('afterend', message);
            }
            message.textContent = 'Thanks — watch your inbox for launch updates.';

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2400);
        });
    });
}

/* ===================================
   SCROLL ANIMATIONS
   =================================== */
function initScrollAnimations() {
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

    document.querySelectorAll('.feature-card, .launch-card, .media-card').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

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
