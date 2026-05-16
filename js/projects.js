const projectFiles = ['project-1.json', 'project-2.json', 'project-3.json'];

async function loadProjects() {
    const container = document.getElementById('projects-container');
    const loader = document.getElementById('loader');
    
    try {
        const projects = [];
        
        // Fetch all project files
        for (const file of projectFiles) {
            try {
                const response = await fetch(`/content/projects/${file}`);
                if (response.ok) {
                    const data = await response.json();
                    projects.push(data);
                }
            } catch (e) {
                console.warn(`Could not load ${file}`);
            }
        }
        
        loader.style.display = 'none';
        
        if (projects.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">لا توجد مشاريع مضافة حالياً.</p>';
            return;
        }

        projects.forEach(project => {
            const mainImage = (project.images && project.images.length > 0) ? project.images[0] : 'https://via.placeholder.com/600x400?text=Project';
            
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            // Allow multiple images viewer if applicable (here we just show main image, open modal on click)
            item.innerHTML = `
                <img src="${mainImage}" alt="${project.title}">
                <div class="gallery-overlay">
                    <h3>${project.title}</h3>
                    <p>📍 ${project.location}</p>
                    <p style="font-size:0.9rem; margin-top:5px;">${project.description || ''}</p>
                </div>
            `;
            
            item.addEventListener('click', () => {
                openModal(mainImage);
            });
            
            container.appendChild(item);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
        loader.style.display = 'none';
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">حدث خطأ أثناء تحميل البيانات.</p>';
    }
}

// Modal logic
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close-modal');

function openModal(imgSrc) {
    modal.style.display = 'flex';
    modalImg.src = imgSrc;
}

if (closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadProjects, 500);
});
