document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWaitlistForms();
    initHeaderShadow();
});

function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('[data-nav-menu]');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('is-open');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open navigation');
        });
    });
}

function initWaitlistForms() {
    document.querySelectorAll('.waitlist-form').forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const input = form.querySelector('input[type="email"]');
            const button = form.querySelector('button');
            const email = input.value.trim();

            if (!email || !email.includes('@')) {
                input.focus();
                input.style.boxShadow = '0 0 0 4px rgba(255, 95, 95, 0.25)';
                setTimeout(() => {
                    input.style.boxShadow = '';
                }, 1800);
                return;
            }

            const originalText = button.textContent;
            button.textContent = 'You’re on the list';
            button.disabled = true;
            input.value = '';

            let message = form.parentElement.querySelector('.waitlist-success');
            if (!message) {
                message = document.createElement('p');
                message.className = 'waitlist-success';
                form.insertAdjacentElement('afterend', message);
            }

            message.textContent = 'Thanks — watch your inbox for SwapBelt launch updates.';

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2600);
        });
    });
}

function initHeaderShadow() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const setShadow = () => {
        header.style.boxShadow = window.scrollY > 24 ? '0 10px 30px rgba(16, 17, 20, 0.08)' : 'none';
    };

    setShadow();
    window.addEventListener('scroll', setShadow, { passive: true });
}
