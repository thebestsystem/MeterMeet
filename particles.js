/**
 * Golden Interactive Particles System for MeterMeet
 * Creates floating golden particles that react to mouse movement
 * and adjust density based on meeting costs
 */

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };
        
        // Configuration
        this.config = {
            baseParticleCount: 50,
            maxParticleCount: 200,
            minParticleCount: 20,
            colors: {
                primary: 'rgba(255, 215, 0, 0.8)',      // Gold
                secondary: 'rgba(255, 193, 7, 0.6)',    // Amber
                accent: 'rgba(255, 235, 59, 0.4)',      // Light Yellow
                highlight: 'rgba(255, 255, 255, 0.9)'   // White highlight
            },
            particle: {
                minSize: 1,
                maxSize: 4,
                minSpeed: 0.2,
                maxSpeed: 1.5,
                connectionDistance: 120,
                mouseAttraction: 0.05,
                mouseRepulsion: 0.1
            }
        };
        
        this.currentCost = 0;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.start();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Update particle positions if canvas was resized
        if (this.particles.length > 0) {
            this.particles.forEach(particle => {
                if (particle.x > this.canvas.width) particle.x = this.canvas.width;
                if (particle.y > this.canvas.height) particle.y = this.canvas.height;
            });
        }
    }
    
    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Mouse leave - reset position
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Performance optimization - pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = this.calculateParticleCount();
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const colors = Object.values(this.config.colors);
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * (this.config.particle.maxSpeed * 2),
            vy: (Math.random() - 0.5) * (this.config.particle.maxSpeed * 2),
            size: Math.random() * (this.config.particle.maxSize - this.config.particle.minSize) + this.config.particle.minSize,
            color: color,
            originalColor: color,
            alpha: Math.random() * 0.8 + 0.2,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            trail: []
        };
    }
    
    calculateParticleCount() {
        // Base particle count
        let count = this.config.baseParticleCount;
        
        // Increase particles based on cost (more expensive = more particles)
        if (this.currentCost > 0) {
            const costMultiplier = Math.min(this.currentCost / 1000, 3); // Cap at 3x
            count += Math.floor(costMultiplier * 50);
        }
        
        // Ensure within bounds
        count = Math.max(this.config.minParticleCount, count);
        count = Math.min(this.config.maxParticleCount, count);
        
        return count;
    }
    
    updateCost(cost) {
        this.currentCost = cost;
        
        // Adjust particle count based on cost
        const targetCount = this.calculateParticleCount();
        const currentCount = this.particles.length;
        
        if (targetCount > currentCount) {
            // Add particles
            for (let i = 0; i < targetCount - currentCount; i++) {
                this.particles.push(this.createParticle());
            }
        } else if (targetCount < currentCount) {
            // Remove particles (fade out effect)
            this.particles.splice(targetCount);
        }
        
        // Update particle colors based on cost level
        this.updateParticleColors(cost);
    }
    
    updateParticleColors(cost) {
        let colorSet;
        
        if (cost < 100) {
            // Low cost - soft gold
            colorSet = ['rgba(255, 235, 59, 0.6)', 'rgba(255, 215, 0, 0.4)'];
        } else if (cost < 500) {
            // Medium cost - bright gold
            colorSet = ['rgba(255, 215, 0, 0.8)', 'rgba(255, 193, 7, 0.7)'];
        } else if (cost < 1000) {
            // High cost - intense gold with orange
            colorSet = ['rgba(255, 193, 7, 0.9)', 'rgba(255, 152, 0, 0.8)'];
        } else {
            // Very high cost - red-orange particles
            colorSet = ['rgba(255, 87, 34, 0.9)', 'rgba(244, 67, 54, 0.8)'];
        }
        
        // Gradually transition particle colors
        this.particles.forEach(particle => {
            if (Math.random() < 0.1) { // 10% chance to change color each frame
                particle.color = colorSet[Math.floor(Math.random() * colorSet.length)];
            }
        });
    }
    
    updateParticle(particle) {
        // Store previous position for trail effect
        particle.trail.unshift({ x: particle.x, y: particle.y });
        if (particle.trail.length > 5) {
            particle.trail.pop();
        }
        
        // Mouse interaction
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                // Attraction/Repulsion based on mouse position
                const attraction = this.config.particle.mouseAttraction * force;
                particle.vx += Math.cos(angle) * attraction;
                particle.vy += Math.sin(angle) * attraction;
                
                // Add some sparkle effect when close to mouse
                if (distance < 50) {
                    particle.alpha = Math.min(1, particle.alpha + 0.1);
                    particle.size = Math.min(particle.size * 1.1, this.config.particle.maxSize * 1.5);
                }
            }
        }
        
        // Natural movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Pulse animation
        particle.pulse += particle.pulseSpeed;
        particle.alpha = 0.3 + Math.sin(particle.pulse) * 0.3;
        
        // Boundary collision with smooth bounce
        if (particle.x <= 0 || particle.x >= this.canvas.width) {
            particle.vx *= -0.8;
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= this.canvas.height) {
            particle.vy *= -0.8;
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        }
        
        // Velocity damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Gradual size return to normal
        if (particle.size > this.config.particle.maxSize) {
            particle.size *= 0.98;
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        
        // Draw trail
        particle.trail.forEach((point, index) => {
            const trailAlpha = (particle.trail.length - index) / particle.trail.length * 0.3;
            this.ctx.globalAlpha = trailAlpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, particle.size * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw main particle
        this.ctx.globalAlpha = particle.alpha;
        
        // Create gradient for particle
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add glow effect for larger particles
        if (particle.size > 2) {
            this.ctx.globalAlpha = particle.alpha * 0.5;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    drawConnections() {
        this.ctx.save();
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.particle.connectionDistance) {
                    const opacity = 1 - (distance / this.config.particle.connectionDistance);
                    this.ctx.globalAlpha = opacity * 0.2;
                    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.restore();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // Clear canvas with slight fade effect for trails
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'; // Very subtle fade
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // Draw connections between nearby particles
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.isRunning) {
            this.start();
        }
    }
    
    destroy() {
        this.pause();
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseleave', this.handleMouseLeave);
        window.removeEventListener('resize', this.handleResize);
    }
    
    // Method to add burst effect at specific location
    addBurst(x, y, intensity = 1) {
        const burstCount = Math.floor(10 * intensity);
        for (let i = 0; i < burstCount; i++) {
            const particle = this.createParticle();
            particle.x = x + (Math.random() - 0.5) * 50;
            particle.y = y + (Math.random() - 0.5) * 50;
            particle.vx = (Math.random() - 0.5) * 4;
            particle.vy = (Math.random() - 0.5) * 4;
            particle.size = Math.random() * 3 + 2;
            particle.color = 'rgba(255, 215, 0, 0.9)';
            this.particles.push(particle);
            
            // Remove burst particles after a short time
            setTimeout(() => {
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
            }, 2000);
        }
    }
}

// Initialize particle system when DOM is loaded
let particleSystem = null;

function initParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        particleSystem = new ParticleSystem(canvas);
    }
}

function updateParticleCost(cost) {
    if (particleSystem) {
        particleSystem.updateCost(cost);
    }
}

function triggerCostBurst(cost) {
    if (particleSystem && cost > 0) {
        // Trigger burst at center of screen
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const intensity = Math.min(cost / 100, 3);
        particleSystem.addBurst(x, y, intensity);
    }
}

// Export functions for use in main application
window.ParticleSystem = ParticleSystem;
window.initParticleSystem = initParticleSystem;
window.updateParticleCost = updateParticleCost;
window.triggerCostBurst = triggerCostBurst;