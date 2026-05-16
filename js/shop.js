const shopFiles = ['jinko-725w.json', 'battery-5kwh.json', 'battery-15kwh.json', 'inverter-6kw.json', 'inverter-6-6kw.json', 'inverter-10-6kw.json', 'inverter-11kw.json'];
let shopItems = [];

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const num = parseFloat(priceStr.replace(/[^0-9.-]+/g,""));
    return isNaN(num) ? 0 : num;
}

async function loadShopItems() {
    const loader = document.getElementById('loader');
    
    try {
        for (const file of shopFiles) {
            try {
                const response = await fetch(`/content/components/${file}`);
                if (response.ok) {
                    const data = await response.json();
                    shopItems.push(data);
                }
            } catch (e) {}
        }
        
        loader.style.display = 'none';
        renderShop(shopItems);

    } catch (error) {
        loader.style.display = 'none';
        document.getElementById('shop-container').innerHTML = '<p style="grid-column: 1/-1; text-align: center;">حدث خطأ أثناء تحميل البيانات.</p>';
    }
}

function renderShop(items) {
    const container = document.getElementById('shop-container');
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">لا توجد منتجات مطابقة.</p>';
        return;
    }

    items.forEach(item => {
        const waLink = generateWhatsAppLink(`شراء ${item.title}`);
        const imagePath = item.image ? item.image : 'https://via.placeholder.com/400x300?text=Product';
        
        const card = document.createElement('div');
        card.className = 'product-card animate';
        card.innerHTML = `
            <div class="product-badge">${translateCategory(item.category)}</div>
            <div class="product-img-container">
                <img src="${imagePath}" alt="${item.title}" class="product-img">
            </div>
            <div class="product-name">${item.title}</div>
            <div class="product-price">
                <span class="price-label">السعر</span>
                <span class="price-val">${item.price}</span>
            </div>
            <div class="product-actions" style="margin-top: auto;">
                <a href="${waLink}" target="_blank" class="btn-whatsapp">طلب عبر واتساب ←</a>
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
    setTimeout(loadShopItems, 500);

    const searchInput = document.getElementById('shop-search');
    const categoryFilter = document.getElementById('shop-category');
    const sortFilter = document.getElementById('shop-sort');

    function applyFiltersAndSort() {
        const search = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const sort = sortFilter.value;

        let filtered = shopItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(search);
            const matchesCat = category === 'all' || item.category === category;
            return matchesSearch && matchesCat;
        });

        if (sort === 'price-asc') {
            filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        } else if (sort === 'price-desc') {
            filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        }

        renderShop(filtered);
    }

    searchInput.addEventListener('input', applyFiltersAndSort);
    categoryFilter.addEventListener('change', applyFiltersAndSort);
    sortFilter.addEventListener('change', applyFiltersAndSort);
});
