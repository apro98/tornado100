const systemFiles = ['10a.json', '15a.json', '20a.json', '30a.json', '40a.json', '50a.json'];

async function loadSystems() {
    const container = document.getElementById('systems-container');
    const loader = document.getElementById('loader');
    
    try {
        const systems = [];
        for (const file of systemFiles) {
            try {
                const response = await fetch(`/content/systems/${file}`);
                if (response.ok) {
                    const data = await response.json();
                    systems.push(data);
                }
            } catch (e) {}
        }
        
        loader.style.display = 'none';
        
        if (systems.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">لا توجد منظومات مضافة حالياً.</p>';
            return;
        }

        systems.forEach(system => {
            const waLink = generateWhatsAppLink(`منظومة ${system.title} (${system.amper})`);
            const phoneLink = `tel:${globalSettings ? globalSettings.phone_number : ''}`;
            
            const imagePath = system.image ? system.image : 'https://via.placeholder.com/400x300?text=Tornado+Solar';
            
            // Format specs into li elements
            let specsHTML = '';
            if (system.specs) {
                const lines = system.specs.split('\n');
                specsHTML = lines.map(l => {
                    let cleaned = l.replace(/^-/, '').trim();
                    if(cleaned) return `<li>${cleaned}</li>`;
                    return '';
                }).join('');
            }
            
            const card = document.createElement('div');
            card.className = 'product-card animate';
            card.innerHTML = `
                <div class="product-badge">${system.amper}</div>
                <div class="product-img-container">
                    <img src="${imagePath}" alt="${system.title}" class="product-img">
                </div>
                <div class="product-name">${system.title}</div>
                <div class="product-amps">${system.amper} <span>أمبير</span></div>
                <div class="product-price">
                    <span class="price-label">السعر</span>
                    <span class="price-val">${system.price || 'حسب الطلب'}</span>
                </div>
                <ul class="product-features">
                    ${specsHTML}
                </ul>
                <div class="product-actions">
                    <a href="${waLink}" target="_blank" class="btn-whatsapp">استفسار واتساب ←</a>
                    <a href="${phoneLink}" class="btn-outline">اتصال مباشر</a>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        loader.style.display = 'none';
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">حدث خطأ أثناء تحميل البيانات.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadSystems, 500);
});
