/**
 * MAK POWER - Electronics & Mobile Accessories
 * Interactive Website Scripts
 */

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initScrollSpy();
    initProductFilters();
    initCountdownTimer();
    initNewsletter();
    initWhatsAppLinks();
    initSmoothScroll();
});

// Toast Notification
function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

// Mobile Menu
function initMobileMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');
    if (!nav || !toggle) return;

    toggle.addEventListener('click', function () {
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Scroll Spy & Header Blur Effect
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id], footer[id], div[id]');
    const navLinks = document.querySelectorAll('nav#mainNav a');
    const header = document.querySelector('header.header');

    window.addEventListener('scroll', function () {
        const scrollY = window.pageYOffset;

        // Sticky header shadow change
        if (header) {
            if (scrollY > 40) {
                header.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.08)';
            } else {
                header.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.05)';
            }
        }

        // Active link detection
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        if (currentId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Product Category Filters
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterButtons.length || !productCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

// Live Countdown Timer for Deals (Urgency timer that resets daily)
function initCountdownTimer() {
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-mins');
    const secsEl = document.getElementById('timer-secs');
    if (!hoursEl || !minsEl || !secsEl) return;

    function updateTimer() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const diff = endOfDay - now;

        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        hoursEl.textContent = String(h).padStart(2, '0');
        minsEl.textContent = String(m).padStart(2, '0');
        secsEl.textContent = String(s).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// WhatsApp Enquire Pre-filling
function initWhatsAppLinks() {
    const enquiryButtons = document.querySelectorAll('.btn-enquire-whatsapp');
    const phoneNumber = '919942670379';

    enquiryButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product') || 'Electronics & Accessories';
            const message = encodeURIComponent(`Hello MAK POWER! I am interested in "${productName}". Please share price, availability, and warranty details.`);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            showToast(`Opening WhatsApp for ${productName}...`);
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 300);
        });
    });
}

// Newsletter Subscription Form
function initNewsletter() {
    const form = document.querySelector('.newsletter-form-wrapper');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value.trim()) {
            showToast('Thank you! You are subscribed to MAK POWER updates ⚡');
            input.value = '';
        }
    });
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}
