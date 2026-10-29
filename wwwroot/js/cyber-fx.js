// ==========================================================================
// VAULTCODE — Visual Effects & Particle Engine (Zero External Dependencies)
// ==========================================================================

(function () {
    'use strict';

    window.CyberFX = {
        _animId: null,
        _resizeHandler: null,
        _activeCanvas: null,
        _glitchTimeout: null,

        /**
         * Spawns 70-100 high-speed radiating emerald sparks, green energy lines,
         * and tiny digital matrix fragments/glyphs bursting outward from the center,
         * decaying with physics (velocity, friction, gravity, fadeout) in requestAnimationFrame.
         * Auto-resizes to window width/height, cleans itself up, and stops animating when done.
         * @param {string} [canvasId] Optional ID of canvas element. If not provided or not found,
         * creates a dynamic overlay canvas.
         */
        launchVictoryParticles(canvasId) {
            // Cancel any currently running animation & cleanup previous listeners
            if (this._animId) {
                cancelAnimationFrame(this._animId);
                this._animId = null;
            }
            if (this._resizeHandler) {
                window.removeEventListener('resize', this._resizeHandler);
                this._resizeHandler = null;
            }

            let canvas = canvasId ? document.getElementById(canvasId) : null;
            let dynamicCanvas = false;

            if (!canvas) {
                let existing = document.getElementById('cyber-fx-victory-canvas');
                if (existing) {
                    canvas = existing;
                } else {
                    canvas = document.createElement('canvas');
                    canvas.id = 'cyber-fx-victory-canvas';
                    canvas.style.position = 'fixed';
                    canvas.style.top = '0';
                    canvas.style.left = '0';
                    canvas.style.right = '0';
                    canvas.style.bottom = '0';
                    canvas.style.width = '100vw';
                    canvas.style.height = '100vh';
                    canvas.style.pointerEvents = 'none';
                    canvas.style.zIndex = '99999';
                    document.documentElement.appendChild(canvas);
                    dynamicCanvas = true;
                }
            }
            this._activeCanvas = canvas;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            resize();
            this._resizeHandler = resize;
            window.addEventListener('resize', this._resizeHandler);

            const originX = canvas.width / 2;
            const originY = canvas.height / 2;

            const particles = [];
            const glyphChars = ['0', '1', 'λ', 'Ω', '▓', '░', '>', '<', '#', '%', '{', '}', '∆', '§', '0x', 'FF', 'V'];
            const sparkColors = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'];

            // 1. Spawns 45 Emerald Sparks (radiating sparks)
            for (let i = 0; i < 45; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 12 + 6;
                particles.push({
                    type: 'spark',
                    x: originX + (Math.random() - 0.5) * 16,
                    y: originY + (Math.random() - 0.5) * 16,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 3 + 2,
                    color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
                    friction: 0.96,
                    gravity: 0.08,
                    alpha: 1.0,
                    fadeRate: Math.random() * 0.012 + 0.012
                });
            }

            // 2. Spawns 25 Green Energy Lines (high-speed laser trace streaks)
            for (let i = 0; i < 25; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 16 + 10;
                particles.push({
                    type: 'line',
                    x: originX,
                    y: originY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    length: Math.random() * 22 + 14,
                    lineWidth: Math.random() * 2 + 1.5,
                    color: '#34d399',
                    friction: 0.95,
                    gravity: 0.04,
                    alpha: 1.0,
                    fadeRate: Math.random() * 0.018 + 0.014
                });
            }

            // 3. Spawns 20 Digital Matrix Fragments / Glyphs
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 9 + 4;
                particles.push({
                    type: 'glyph',
                    x: originX + (Math.random() - 0.5) * 20,
                    y: originY + (Math.random() - 0.5) * 20,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    glyph: glyphChars[Math.floor(Math.random() * glyphChars.length)],
                    fontSize: Math.floor(Math.random() * 6 + 12),
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.1,
                    friction: 0.97,
                    gravity: 0.06,
                    alpha: 1.0,
                    fadeRate: Math.random() * 0.013 + 0.009
                });
            }

            const self = this;
            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                let aliveCount = 0;

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    if (p.alpha <= 0) continue;

                    // Physics update: velocity, friction, gravity, fadeout
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= p.friction;
                    p.vy *= p.friction;
                    p.vy += p.gravity;
                    p.alpha -= p.fadeRate;

                    if (p.alpha <= 0) {
                        p.alpha = 0;
                        continue;
                    }

                    aliveCount++;

                    // Render particle by type
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);

                    if (p.type === 'spark') {
                        ctx.fillStyle = p.color;
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (p.type === 'line') {
                        ctx.strokeStyle = p.color;
                        ctx.lineWidth = p.lineWidth;
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = p.color;
                        const vMag = Math.hypot(p.vx, p.vy) || 1;
                        const tailX = p.x - (p.vx / vMag) * p.length;
                        const tailY = p.y - (p.vy / vMag) * p.length;
                        ctx.beginPath();
                        ctx.moveTo(tailX, tailY);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                    } else if (p.type === 'glyph') {
                        p.rotation += p.rotSpeed;
                        ctx.fillStyle = '#34d399';
                        ctx.font = `bold ${p.fontSize}px monospace`;
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = '#10b981';
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation);
                        ctx.fillText(p.glyph, 0, 0);
                    }

                    ctx.restore();
                }

                if (aliveCount > 0) {
                    self._animId = requestAnimationFrame(animate);
                } else {
                    // Cleanup when all particles fade out
                    cancelAnimationFrame(self._animId);
                    self._animId = null;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (self._resizeHandler) {
                        window.removeEventListener('resize', self._resizeHandler);
                        self._resizeHandler = null;
                    }
                    if (dynamicCanvas && canvas.parentNode) {
                        canvas.parentNode.removeChild(canvas);
                    }
                    self._activeCanvas = null;
                }
            };

            this._animId = requestAnimationFrame(animate);
        },

        /**
         * Quick 200ms DOM glitch effect or trigger for the penalty state.
         * Creates a CRT scanline malfunction overlay and rapid micro-jitter.
         */
        triggerGlitchFlash() {
            if (this._glitchTimeout) {
                clearTimeout(this._glitchTimeout);
                this._glitchTimeout = null;
            }

            let overlay = document.getElementById('cyber-fx-glitch-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'cyber-fx-glitch-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.right = '0';
                overlay.style.bottom = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.pointerEvents = 'none';
                overlay.style.zIndex = '99998';
                overlay.style.backgroundImage = 'repeating-linear-gradient(0deg, rgba(239, 68, 68, 0.28) 0px, rgba(239, 68, 68, 0.28) 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px)';
                overlay.style.boxShadow = 'inset 0 0 120px rgba(239, 68, 68, 0.6)';
                overlay.style.mixBlendMode = 'screen';
                document.documentElement.appendChild(overlay);
            }

            overlay.style.display = 'block';
            overlay.style.opacity = '1';

            // Jitter #app or the main terminal container so body remains clean for fixed viewport overlays at any scroll position
            const target = document.getElementById('app') || document.body;
            const originalTransform = target.style.transform;
            const offsets = [
                { t: 0, x: -6, y: 3 },
                { t: 40, x: 7, y: -4 },
                { t: 85, x: -5, y: -2 },
                { t: 135, x: 4, y: 3 },
                { t: 175, x: -2, y: 1 }
            ];

            offsets.forEach(step => {
                setTimeout(() => {
                    target.style.transform = `translate(${step.x}px, ${step.y}px)`;
                }, step.t);
            });

            this._glitchTimeout = setTimeout(() => {
                target.style.transform = originalTransform || '';
                if (overlay) {
                    overlay.style.display = 'none';
                }
                this._glitchTimeout = null;
            }, 220);

            try {
                window.dispatchEvent(new CustomEvent('cyber-glitch-flash'));
            } catch (e) {}
        }
    };
})();
