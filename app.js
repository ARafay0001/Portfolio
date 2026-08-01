const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* =========================================================
   MOBILE NAV
   ========================================================= */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================================
   ACTIVE NAV LINK ON SCROLL
   ========================================================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

if (sections.length && navLinks.length && "IntersectionObserver" in window) {
  const linkFor = (id) =>
    [...navLinks].find((a) => a.getAttribute("href") === `#${id}`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

/* =========================================================
   SCROLL PROGRESS BAR
   ========================================================= */
const progressBar = document.getElementById("scrollProgress");

function updateProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* =========================================================
   HERO TYPEWRITER
   ========================================================= */
const typewriterEl = document.getElementById("typewriter");
const roles = [
  "Front-End Developer",
  "MERN Stack Developer", 
  "Aspiring Full Stack Developer",
  "Cybersecurity Enthusiast",
];

function typewriter() {
  if (!typewriterEl) return;

  if (prefersReducedMotion) {
    typewriterEl.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 35 : 65);
  };

  tick();
}
typewriter();

/* =========================================================
   PARTICLE FIELD (blueprint / signal theme)
   ========================================================= */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let width, height;

const resize = () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
};
window.addEventListener("resize", resize);
resize();

const mouse = { x: null, y: null };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener(
  "touchmove",
  (e) => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  },
  { passive: true }
);
window.addEventListener("mouseout", () => (mouse.x = mouse.y = null));

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const numParticles = isMobile ? 40 : 180;
const connectDist = isMobile ? 120 : 180;
const PARTICLE_COLOR = "255,107,53"; // accent orange, matches CSS --accent

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.size = Math.random() * 3.4 + 0.4;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${PARTICLE_COLOR},0.65)`;
    ctx.fill();
  }
}

const particles = Array.from({ length: numParticles }, () => new Particle());

function connect() {
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = dx * dx + dy * dy;

      if (dist < connectDist * connectDist) {
        const opacity = 1 - dist / (connectDist * connectDist);
        ctx.strokeStyle = `rgba(${PARTICLE_COLOR},${opacity * 0.18})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    if (mouse.x && mouse.y) {
      const dx = p1.x - mouse.x;
      const dy = p1.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connectDist) {
        const opacity = 1 - dist / connectDist;
        ctx.strokeStyle = `rgba(${PARTICLE_COLOR},${opacity * 0.4})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

let rafId = null;

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    p.move();
    p.draw();
  }
  connect();
  rafId = requestAnimationFrame(animate);
}

// Respect reduced-motion: draw a single static frame instead of animating.
if (prefersReducedMotion) {
  for (const p of particles) p.draw();
  connect();
} else {
  animate();

  // Pause the loop while the tab is hidden to save CPU/battery.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  });
}
/* =========================================================
   CURSOR
   ========================================================= */

   const crosshair = document.getElementById("cursorCrosshair");
const supportsFinePointer = window.matchMedia(
  "(pointer: fine) and (hover: hover)"
).matches;

if (crosshair && supportsFinePointer) {
  document.body.classList.add("has-custom-cursor");

  const mouse = { x: null, y: null };
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    crosshair.style.opacity = "1";
  });
  window.addEventListener("mouseout", () => {
    crosshair.style.opacity = "0";
  });

  const hoverSelector = "a, button, .skillcard, .project-card";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverSelector)) crosshair.classList.add("active");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverSelector)) crosshair.classList.remove("active");
  });

  function moveCrosshair() {
    if (mouse.x !== null && mouse.y !== null) {
      cx += (mouse.x - cx) * 0.5;
      cy += (mouse.y - cy) * 0.5;
      crosshair.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(moveCrosshair);
  }
  moveCrosshair();
}
