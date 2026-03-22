document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Drawer Logic ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active'); // Animates burger to X
        });
    }

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // --- Navbar Blur/Shadow on Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 70; // Height of fixed navbar
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll-triggered Fade Animations ---
    const scrollElements = document.querySelectorAll(".active-on-scroll");

    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= ((window.innerHeight || document.documentElement.clientHeight) - offset)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("scrolled-in");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 50)) { // Triggers slightly before element comes fully into view
                displayScrollElement(el);
            }
        });
    }

    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Trigger on initial load

    // --- Ambient Background Particles (UPDATED FOR MORE POP) ---
    const drawArea = document.getElementById('particleBg');
    const ctx = drawArea.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        drawArea.width = window.innerWidth;
        drawArea.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * drawArea.width;
            this.y = Math.random() * drawArea.height;
            this.vx = (Math.random() - 0.5) * 0.3; // Very slow drift
            this.vy = (Math.random() - 0.5) * 0.3;
            // NEW: Increased size slightly
            this.size = Math.random() * 2.5 + 1.5; 
            
            // NEW: Removed pure white so they pop more against light bg
            const colors = ['#10B981', '#34D399', '#011E15', '#A7F3D0'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            this.life = 0;
            this.maxLife = Math.random() * 400 + 200;
            this.opacity = 0;
        }
        update() {
            this.x += this.vx; this.y += this.vy; this.life++;
            const fadePoint = 50;
            if (this.life < fadePoint) this.opacity = this.life / fadePoint;
            else if (this.life > this.maxLife - fadePoint) this.opacity = (this.maxLife - this.life) / fadePoint;
            else this.opacity = 1;

            if (this.x < 0) this.x = drawArea.width;
            if (this.x > drawArea.width) this.x = 0;
            if (this.y < 0) this.y = drawArea.height;
            if (this.y > drawArea.height) this.y = 0;
            if (this.life >= this.maxLife) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            // NEW: Increased opacity from 0.3 to 0.6 for more pop
            ctx.globalAlpha = this.opacity * 0.6; 
            ctx.fill();
            ctx.globalAlpha = 1.0; 
        }
    }

    const pCount = window.innerWidth < 768 ? 30 : 70; // Fewer particles on mobile
    for (let i = 0; i < pCount; i++) {
        const p = new Particle();
        p.life = Math.random() * p.maxLife; 
        particles.push(p);
    }

    function animateBg() {
        ctx.clearRect(0, 0, drawArea.width, drawArea.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateBg);
    }
    animateBg();
});