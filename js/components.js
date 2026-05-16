const componentFiles = ['jinko-725w.json', 'battery-5kwh.json', 'battery-15kwh.json', 'inverter-6kw.json', 'inverter-6-6kw.json', 'inverter-10-6kw.json', 'inverter-11kw.json'];
let allComponents = [];

async function loadComponents() {
    const loader = document.getElementById('loader');
    
    try {
        for (const file of componentFiles) {
            try {
                const response = await fetch(`/content/components/${file}`);
                if (response.ok) {
                    const data = await response.json();
                    allComponents.push(data);
                }
            } catch (e) {}
        }
        
        loader.style.display = 'none';
        renderComponents(allComponents);

    } catch (error) {
        loader.style.display = 'none';
        document.getElementById('components-container').innerHTML = '<p style="grid-column: 1/-1; text-align: center;">حدث خطأ أثناء تحميل البيانات.</p>';
    }
}

function renderComponents(components) {
    const container = document.getElementById('components-container');
    container.innerHTML = '';

    if (components.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">لا توجد مكونات مطابقة للبحث.</p>';
        return;
    }

    components.forEach(comp => {
        const waLink = generateWhatsAppLink(`المكون ${comp.title}`);
        const imagePath = comp.image ? comp.image : 'https://via.placeholder.com/400x300?text=Component';
        
        let specsHTML = '';
        if (comp.specs) {
            specsHTML = comp.specs.split('\n').map(l => {
                let cleaned = l.replace(/^-/, '').trim();
                return cleaned ? `<p>${cleaned}</p>` : '';
            }).join('');
        }

        const card = document.createElement('div');
        card.className = 'product-card animate';
        card.innerHTML = `
            <div class="product-badge">${translateCategory(comp.category)}</div>
            <div class="product-img-container">
                <img src="${imagePath}" alt="${comp.title}" class="product-img">
            </div>
            <div class="product-name">${comp.title}</div>
            <div class="product-price">
                <span class="price-label">السعر</span>
                <span class="price-val">${comp.price}</span>
            </div>
            <div style="font-size: 13px; color: var(--gray); margin-bottom: 10px;">${comp.description || ''}</div>
            <div class="product-specs">
                ${specsHTML}
            </div>
            <div class="product-actions" style="margin-top: auto;">
                <a href="${waLink}" target="_blank" class="btn-whatsapp">استفسار واتساب ←</a>
            </div>
        `;
        container.appendChild(card);
    });
}

function translateCategory(cat) {
    const map = {
        'Panels': 'ألواح شمسية',
        'Batteries': 'بطاريات',
        'Inverters': 'انفرترات',
        'Accessories': 'ملحقات'
    };
    return map[cat] || cat;
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadComponents, 500);

    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    function filterData() {
        const search = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        const filtered = allComponents.filter(comp => {
            const matchesSearch = comp.title.toLowerCase().includes(search) || (comp.description && comp.description.toLowerCase().includes(search));
            const matchesCat = category === 'all' || comp.category === category;
            return matchesSearch && matchesCat;
        });

        renderComponents(filtered);
    }

    searchInput.addEventListener('input', filterData);
    categoryFilter.addEventListener('change', filterData);
});
