// ⚡ Neon Particles with Cursor Interaction
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
const numParticles = isMobile ? 40 : 100;
const connectDist = isMobile ? 80 : 120;

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 1.5 + 0.5;
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
    ctx.fillStyle = "rgba(0,255,136,0.8)";
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
        ctx.strokeStyle = `rgba(0,255,136,${opacity * 0.25})`;
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
        ctx.strokeStyle = `rgba(0,255,136,${opacity * 0.5})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    p.move();
    p.draw();
  }
  connect();
  requestAnimationFrame(animate);
}

animate();
