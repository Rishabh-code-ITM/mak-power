```javascript
/*
    MAK POWER
    Electronics & Mobile Accessories
    Custom JavaScript
*/

// Mobile Menu Toggle
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');

    if (!nav || !toggle) return;

    nav.classList.toggle('active');
    toggle.classList.toggle('active');

    toggle.setAttribute(
        'aria-expanded',
        toggle.classList.contains('active')
    );
}

// Close Mobile Menu
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function () {
        const nav = document.getElementById('mainNav');
        const toggle = document.querySelector('.menu-toggle');

        if (nav) nav.classList.remove('active');
        if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Close Menu When Clicking Outside
document.addEventListener('click', function (event) {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.menu-toggle');

    if (!nav || !toggle) return;

    if (
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
    ) {
        nav.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    }
});

// Active Navigation Highlight on Scroll
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('nav a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');

        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');

        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero Graphics Rotation
let currentGraphic = 0;

const graphics = document.querySelectorAll('.hero-illustration');
const totalGraphics = graphics.length;

function rotateGraphics() {
    if (totalGraphics <= 1) return;

    graphics[currentGraphic].classList.remove('active');

    currentGraphic = (currentGraphic + 1) % totalGraphics;

    graphics[currentGraphic].classList.add('active');
}

// Rotate Hero Graphics Every 3 Seconds
if (totalGraphics > 1) {
    setInterval(rotateGraphics, 3000);
}

// Initialize First Hero Graphic
if (totalGraphics > 0) {
    graphics.forEach((graphic, index) => {
        graphic.classList.toggle('active', index === 0);
    });
}

// Prevent Empty Newsletter Submission
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const emailInput = this.querySelector('.newsletter-input');

        if (emailInput && emailInput.checkValidity()) {
            alert('Thank you for connecting with MAK POWER!');
            this.reset();
        } else if (emailInput) {
            emailInput.reportValidity();
        }
    });
}

// Set Current Year Automatically
const copyrightText = document.querySelector('.copyright p');

if (copyrightText) {
    copyrightText.textContent =
        '© ' + new Date().getFullYear() +
        ' MAK POWER. All Rights Reserved.';
}

// Initialize Website
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.menu-toggle');

    if (toggle) {
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.setAttribute('aria-expanded', 'false');

        toggle.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMenu();
            }
        });
    }
});
```