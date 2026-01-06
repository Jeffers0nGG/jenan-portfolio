// ========================================
// HERO SECTION PARTICLE ANIMATION
// Author: Jenan Jefferson Acio
// ========================================

/**
 * Interactive particle animation for hero section background
 * Creates floating particles that respond to mouse movement
 */

class ParticleAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.particleCount = 80;
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };
        
        this.init();
    }
    
    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hero-particles';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        // Add canvas to hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.insertBefore(this.canvas, heroSection.firstChild);
            this.ctx = this.canvas.getContext('2d');
            
            // Set canvas size
            this.resizeCanvas();
            
            // Create particles
            this.createParticles();
            
            // Event listeners
            window.addEventListener('resize', () => this.resizeCanvas());
            heroSection.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            heroSection.addEventListener('mouseleave', () => this.handleMouseLeave());
            
            // Start animation
            this.animate();
        }
    }
    
    resizeCanvas() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            this.canvas.width = heroSection.offsetWidth;
            this.canvas.height = heroSection.offsetHeight;
        }
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5;
            const speedY = (Math.random() - 0.5) * 0.5;
            
            this.particles.push(new Particle(x, y, size, speedX, speedY));
        }
    }
    
    handleMouseMove(e) {
        const heroSection = document.querySelector('.hero');
        const rect = heroSection.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    handleMouseLeave() {
        this.mouse.x = null;
        this.mouse.y = null;
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.canvas, this.mouse);
            particle.draw(this.ctx);
        });
        
        // Draw connections between nearby particles
        this.connectParticles();
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = 1 - distance / 120;
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseX = x;
        this.baseY = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.density = Math.random() * 30 + 1;
    }
    
    update(canvas, mouse) {
        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            
            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    const dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    const dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        } else {
            // Return to base position
            if (this.x !== this.baseX) {
                const dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                const dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
        
        // Move particles
        this.baseX += this.speedX;
        this.baseY += this.speedY;
        
        // Bounce off edges
        if (this.baseX < 0 || this.baseX > canvas.width) {
            this.speedX = -this.speedX;
        }
        if (this.baseY < 0 || this.baseY > canvas.height) {
            this.speedY = -this.speedY;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

// Initialize particle animation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if device supports animation (not on mobile for performance)
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        new ParticleAnimation();
    }
});

// Add floating animation for hero text elements
document.addEventListener('DOMContentLoaded', function() {
    const heroElements = document.querySelectorAll('.hero-name, .hero-title, .hero-subtitle, .hero-location');
    
    heroElements.forEach((element, index) => {
        element.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
    });
    
    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
});
