// Spawns translucent ellipses along the mouse's path; each one grows
// slightly, then fades out and removes itself.

(function () {
  // Skip touch devices and people who prefer reduced motion.
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const COLORS = ['#ee6bc4', '#f7e47a', '#7fd0f5'];

  const SPAWN_DISTANCE = 25;  // px the mouse must travel before the next ellipse
  const LIFETIME = 1000;      // ms each ellipse lives
  const PEAK_OPACITY = 0.6;
  const MAX_ELLIPSES = 60;    // safety cap

  const container = document.createElement('div');
  container.className = 'cursor-trail';
  container.setAttribute('aria-hidden', 'true');
  document.body.appendChild(container);

  const rand = (min, max) => min + Math.random() * (max - min);

  let last = null;
  let travelled = 0;

  function spawn(x, y, angle) {
    if (container.childElementCount >= MAX_ELLIPSES) {
      container.firstElementChild.remove();
    }

    // Long axis vs short axis, so each one reads as an ellipse.
    const long = rand(50, 75);
    const short = rand(25, 50);

    const el = document.createElement('div');
    el.className = 'cursor-ellipse';
    el.style.width = long + 'px';
    el.style.height = short + 'px';
    el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    container.appendChild(el);

    // Start roughly along the direction of travel, then spin over its lifetime
    // (clockwise or counter-clockwise at random) while drifting forward.
    const startRot = angle + rand(-90, 90);
    const spin = rand(70, 100) * (Math.random() < 0.5 ? -1 : 1);
    const drift = rand(10, 30);
    const rad = angle * (Math.PI / 180);
    const driftX = Math.cos(rad) * drift;
    const driftY = Math.sin(rad) * drift;
 
    // t is progress from 0 to 1 through the animation.
    const pose = (t, scale) =>
      `translate(${x - long / 2 + driftX * t}px, ${y - short / 2 + driftY * t}px) ` +
      `rotate(${startRot + spin * t}deg) scale(${scale})`;
 
    const anim = el.animate(
      [
        // Pop in small, with an overshoot curve so it feels springy.
        { transform: pose(0, 0.3), opacity: 0, easing: 'cubic-bezier(0.34, 1.00, 0.64, 1)' },
        { transform: pose(0.2, 1.1), opacity: PEAK_OPACITY, offset: 0.2 },
        // Keep rotating and drifting while it expands and fades out.
        { transform: pose(1, 1.3), opacity: 0 },
      ],
      { duration: LIFETIME, easing: 'ease-out', fill: 'forwards' }
    );
    anim.onfinish = () => el.remove();
  }

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      travelled += Math.hypot(dx, dy);

      if (travelled >= SPAWN_DISTANCE) {
        spawn(x, y, Math.atan2(dy, dx) * (180 / Math.PI));
        travelled = 0;
      }
    }
    last = { x, y };
  });


  // Don't draw a straight line from where the mouse left to where it re-enters.
  document.addEventListener('mouseleave', () => {
    last = null;
    travelled = 0;
  });
})();