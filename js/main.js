// Global settings and common functionality

let globalSettings = null;

async function loadSettings() {
    try {
        const response = await fetch('/content/settings.json');
        if (!response.ok) throw new Error('Settings not found');
        globalSettings = await response.json();
        applySettings();
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function applySettings() {
    if (!globalSettings) return;

    // Update WhatsApp links
    const whatsappNumber = globalSettings.whatsapp_number.replace(/\D/g, ''); // Remove non-digits
    document.querySelectorAll('.floating-whatsapp, .btn-whatsapp-general').forEach(el => {
        el.href = `https://wa.me/${whatsappNumber}`;
    });

    // Update phone links
    document.querySelectorAll('.btn-phone-general').forEach(el => {
        el.href = `tel:${globalSettings.phone_number}`;
        if (el.classList.contains('show-number')) {
            el.textContent = globalSettings.phone_number;
        }
    });

    // Update hero section if present
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroTitle && globalSettings.hero_title) {
        // Simple heuristic to split for span if we want to mimic the design
        const parts = globalSettings.hero_title.split(' ');
        if(parts.length > 2) {
            heroTitle.innerHTML = parts.slice(0, -2).join(' ') + '<br><span>' + parts.slice(-2).join(' ') + '</span>';
        } else {
            heroTitle.innerHTML = globalSettings.hero_title;
        }
    }
    if (heroSubtitle && globalSettings.hero_subtitle) heroSubtitle.textContent = globalSettings.hero_subtitle;
    
    // Update footer info
    const footerPhone = document.getElementById('footer-phone');
    const footerAddress = document.getElementById('footer-address');
    const footerHours = document.getElementById('footer-hours');
    
    if (footerPhone) footerPhone.textContent = globalSettings.phone_number;
    if (footerAddress) footerAddress.textContent = globalSettings.address;
    if (footerHours) footerHours.textContent = globalSettings.working_hours;
}

function generateWhatsAppLink(productName) {
    if (!globalSettings) return '#';
    const num = globalSettings.whatsapp_number.replace(/\D/g, '');
    const msg = encodeURIComponent(`السلام عليكم، أريد الاستفسار عن ${productName}`);
    return `https://wa.me/${num}?text=${msg}`;
}

// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
});
