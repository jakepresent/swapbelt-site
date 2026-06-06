/* ===================================
   SWAPBELT PRELAUNCH INTERACTIONS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initEarlyAccessForm();
});

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (!mobileMenuBtn) return;

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <ul class="mobile-nav-links">
            <li><a href="#problem">Why</a></li>
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#styles">Styles</a></li>
            <li><a href="#development">Progress</a></li>
            <li><a href="#early-access">Early access</a></li>
        </ul>
        <a href="#early-access" class="btn btn-primary">Join Early Access</a>
    `;
    document.body.appendChild(mobileMenu);

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

function initEarlyAccessForm() {
    const form = document.querySelector('.early-access-form');
    if (!form) return;

    const emailInput = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');

    form.addEventListener('submit', async event => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const honeypot = form.querySelector('input[name="website"]');

        if (honeypot && honeypot.value) {
            return;
        }

        if (!isValidEmail(email)) {
            setFormMessage(message, 'Enter a valid email address.', 'error');
            emailInput.focus();
            return;
        }

        const endpoint = window.SWAPBELT_SUBSCRIBE_ENDPOINT;

        if (!endpoint) {
            setFormMessage(message, 'Early access signup is coming soon.', 'error');
            return;
        }

        button.disabled = true;
        button.textContent = 'Joining...';
        setFormMessage(message, '', '');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    source: 'swapbelt-site',
                    referring_site: window.location.href
                })
            });

            if (!response.ok) {
                throw new Error(`Subscribe failed with ${response.status}`);
            }

            emailInput.value = '';
            setFormMessage(message, "You're on the early access list. Check your email to confirm.", 'success');
        } catch (error) {
            setFormMessage(message, 'Something went wrong. Try again in a minute.', 'error');
        } finally {
            button.disabled = false;
            button.textContent = 'Join Early Access';
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFormMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.classList.remove('success', 'error');
    if (type) {
        element.classList.add(type);
    }
}
