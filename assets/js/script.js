// Toggle hamburger menu
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.querySelector('.hamburger');
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Handle booking form submission
async function handleBooking(event) {
    event.preventDefault();
    
    const form = event.target;
    const formMessage = document.getElementById('formMessage');
    
    // Get selected service types
    const serviceCheckboxes = document.querySelectorAll('input[name="serviceType"]:checked');
    const serviceType = Array.from(serviceCheckboxes).map(cb => cb.value).join(', ');
    
    if (!serviceType) {
        showMessage('Please select at least one service type', 'error');
        return;
    }

    const privacyConsent = form.querySelector('input[name="privacyConsent"]');
    if (!privacyConsent || !privacyConsent.checked) {
        showMessage('Please agree to the Privacy Policy before submitting.', 'error');
        return;
    }
    
    // Create FormData object
    const formData = new FormData(form);
    formData.set('serviceType', serviceType);
    
    try {
        // Submit to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Thank you! Your booking request has been submitted. We\'ll contact you within 24 hours.', 'success');
            form.reset();
        } else {
            showMessage('An error occurred. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

// Show form message
function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// Smooth scroll for anchor links (if smooth scroll isn't working)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations (optional - adds fade-in effect when sections come into view)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Form validation
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const brand = document.getElementById('brand').value;
    const description = document.getElementById('description').value.trim();
    
    // Basic validation
    if (!name || !email || !phone || !brand || !description) {
        showMessage('Please fill in all required fields.', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\d\s+\-()]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 8) {
        showMessage('Please enter a valid phone number.', 'error');
        return false;
    }

    const privacyConsent = document.querySelector('input[name="privacyConsent"]');
    if (!privacyConsent || !privacyConsent.checked) {
        showMessage('Please agree to the Privacy Policy before submitting.', 'error');
        return false;
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Inject privacy consent checkbox if it does not exist.
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm && !bookingForm.querySelector('input[name="privacyConsent"]')) {
        const consentGroup = document.createElement('div');
        consentGroup.className = 'form-group consent-group';
        consentGroup.innerHTML = '<label class="checkbox consent-checkbox"><input type="checkbox" name="privacyConsent" required> I agree to the <a href="/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a> and consent to being contacted about my booking.</label>';

        const submitButton = bookingForm.querySelector('button[type="submit"]');
        if (submitButton) {
            bookingForm.insertBefore(consentGroup, submitButton);
        } else {
            bookingForm.appendChild(consentGroup);
        }
    }

    // Add compliance links in the footer on every page.
    const footerContainer = document.querySelector('.footer .container');
    if (footerContainer && !footerContainer.querySelector('.compliance-links')) {
        const complianceLinks = document.createElement('div');
        complianceLinks.className = 'compliance-links';
        complianceLinks.innerHTML = '<a href="/privacy-policy.html">Privacy Policy</a><span aria-hidden="true">|</span><a href="/terms-of-service.html">Terms of Service</a>';

        const footerBottom = footerContainer.querySelector('.footer-bottom');
        if (footerBottom) {
            footerBottom.appendChild(complianceLinks);
        } else {
            footerContainer.appendChild(complianceLinks);
        }
    }

    // Fade in hero section immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }
    // Video play/pause toggle
    const video = document.getElementById('heroVideo');
    const toggle = document.getElementById('videoToggle');
    if (video && toggle) {
        // Update button state depending on video playing
        function updateButton() {
            if (video.paused) {
                toggle.textContent = '▶';
                toggle.setAttribute('aria-pressed', 'true');
                toggle.setAttribute('aria-label', 'Play background video');
            } else {
                toggle.textContent = '⏸';
                toggle.setAttribute('aria-pressed', 'false');
                toggle.setAttribute('aria-label', 'Pause background video');
            }
        }

        // Initialize
        updateButton();

        // Toggle on click
        toggle.addEventListener('click', function() {
            if (video.paused) {
                video.play().catch(()=>{});
            } else {
                video.pause();
            }
            updateButton();
        });

        const ensurePlayback = () => {
            if (video.paused) {
                video.play().catch(() => {});
            }
        };

        window.addEventListener('pointerdown', ensurePlayback, { once: true, passive: true });
        window.addEventListener('touchstart', ensurePlayback, { once: true, passive: true });

        // Update when user interacts with video (e.g., programmatic events)
        video.addEventListener('play', updateButton);
        video.addEventListener('pause', updateButton);
    }
});
