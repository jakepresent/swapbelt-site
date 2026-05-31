/* ===================================
   SWAPBELT PRELAUNCH INTERACTIONS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initWaitlistForm();
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
            <li><a href="#development">Progress</a></li>
            <li><a href="#waitlist">Waitlist</a></li>
        </ul>
        <a href="#waitlist" class="btn btn-primary">Join Waitlist</a>
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

function initWaitlistForm() {
    const form = document.querySelector('.waitlist-form');
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
            setFormMessage(message, 'Waitlist connection is coming soon. For now, we have the site ready for beehiiv.', 'success');
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
            setFormMessage(message, "You're on the list. We'll send the important updates.", 'success');
        } catch (error) {
            setFormMessage(message, 'Something went wrong. Try again in a minute.', 'error');
        } finally {
            button.disabled = false;
            button.textContent = 'Join Waitlist';
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
