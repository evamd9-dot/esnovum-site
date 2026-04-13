// =========================================
//  SLIDESHOW
// =========================================

function moveSlide(id, direction) {
    const slideshow = document.getElementById(id);
    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.dot');
    let current = [...slides].findIndex(s => s.classList.contains('active'));
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (current + direction + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
}

function goToSlide(id, index) {
    const slideshow = document.getElementById(id);
    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.dot');
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

// Auto-play each slideshow every 3 seconds
['slideshow-1', 'slideshow-2', 'slideshow-3'].forEach(id => {
    setInterval(() => moveSlide(id, 1), 3000);
});
