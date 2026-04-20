const IMAGES_PATH = 'assets/images';

const projectBriefings = {
    project_1: 'A residential project grounded in natural materials and spatial clarity. Each space is designed to respond to light, landscape and the rhythm of daily life.',
    project_2: 'An interior renovation exploring the relationship between old structure and contemporary detail — restoring character while introducing calm and precision.',
    project_3: 'A compact residence developed around a central living core. Materiality and proportion guide the spatial sequence from threshold to private space.',
    project_4: 'A kitchen and bath refurbishment focused on crafted surfaces, considered joinery and the quiet functionality of well-designed domestic space.',
};

function loadProjectThumbnail(containerId, projectName) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const files = (window.projectManifest || {})[projectName];
    if (!files?.length) return;
    container.innerHTML = '';
    container.appendChild(Object.assign(document.createElement('img'), {
        src: `${IMAGES_PATH}/${projectName}/${files[0]}`,
        alt: '',
        className: 'thumb-img',
    }));
}

function openProjectModal(projectName, title) {
    const files = (window.projectManifest || {})[projectName] || [];
    const base = `${IMAGES_PATH}/${projectName}/`;
    const briefing = projectBriefings[projectName] || '';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = e => {
        if (e.target === overlay) closeModal(overlay);
    };
    overlay.innerHTML = `
        <div class="modal">
            <button class="modal-close" aria-label="Close">&times;</button>
            <div class="modal-header">
                <span class="approach-label">${title}</span>
                <p class="modal-briefing">${briefing}</p>
            </div>
            <div class="modal-grid">
                ${files.map(f => `<div class="modal-thumb"><img src="${base}${f}" alt="" loading="lazy"/></div>`).join('')}
            </div>
        </div>`;

    overlay.querySelector('.modal-close').onclick = () => closeModal(overlay);
    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');
    overlay.querySelectorAll('.modal-thumb img').forEach(img => {
        img.onclick = () => openLightbox(img.src, overlay);
    });
    requestAnimationFrame(() => overlay.classList.add('visible'));
}

function closeModal(overlay) {
    overlay.classList.remove('visible');
    overlay.addEventListener('transitionend', () => {
        overlay.remove();
        document.body.classList.remove('modal-open');
    }, {once: true});
}

function openLightbox(src, overlay) {
    const imgs = [...overlay.querySelectorAll('.modal-thumb img')];
    let current = imgs.findIndex(i => i.src === src);

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
        <button class="lightbox-nav lightbox-prev">&#10094;</button>
        <img src="${src}" alt=""/>
        <button class="lightbox-nav lightbox-next">&#10095;</button>
        <button class="lightbox-close">&times;</button>`;

    const imgEl = lb.querySelector('img');
    const navigate = dir => {
        current = (current + dir + imgs.length) % imgs.length;
        imgEl.src = imgs[current].src;
    };
    const removeLb = () => {
        lb.remove();
        document.removeEventListener('keydown', onKey);
    };

    lb.querySelector('.lightbox-prev').onclick = e => {
        e.stopPropagation();
        navigate(-1);
    };
    lb.querySelector('.lightbox-next').onclick = e => {
        e.stopPropagation();
        navigate(1);
    };
    lb.querySelector('.lightbox-close').onclick = e => {
        e.stopPropagation();
        removeLb();
    };
    lb.onclick = removeLb;

    const onKey = e => {
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'Escape') removeLb();
    };
    document.addEventListener('keydown', onKey);

    overlay.appendChild(lb);
    requestAnimationFrame(() => lb.classList.add('visible'));
}

document.querySelectorAll('.project-thumb[data-project]').forEach(el => {
    const project = el.dataset.project;
    loadProjectThumbnail(el.id, project);
    const card = el.closest('.service-card');
    const title = card?.querySelector('h3')?.textContent || project;
    card?.addEventListener('click', () => openProjectModal(project, title));
});
