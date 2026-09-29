document.documentElement.classList.add('js');

// Fade projects in as they scroll into view.
const projects = document.querySelectorAll('.project');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  projects.forEach((p) => io.observe(p));
} else {
  projects.forEach((p) => p.classList.add('visible'));
}

// Little heart pulse on click.
const heart = document.querySelector('.heart');
heart.addEventListener('click', () => {
  heart.classList.add('beat');
  setTimeout(() => heart.classList.remove('beat'), 200);
});

// "about" / "play" have no target sections in the design yet; keep them from jumping.
document.querySelectorAll('.nav a').forEach((a) => {
  if (!document.querySelector(a.getAttribute('href'))) {
    a.addEventListener('click', (e) => e.preventDefault());
  }
});

// If the browser can't play the hero video (or it's missing), fall back to the poster image.
const hero = document.querySelector('.hero-media');
if (hero) {
  hero.addEventListener('error', () => {
    const fallback = document.createElement('img');
    fallback.src = hero.getAttribute('poster');
    fallback.alt = '';
    fallback.style.width = '100%';
    fallback.style.height = '100%';
    fallback.style.objectFit = 'cover';
    hero.replaceWith(fallback);
  }, true);
}