// ============================================
// PING PONG 3D - Glass & Liquid Physics Engine
// ============================================

class PingPong3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ball = null;
        this.playerPaddle = null;
        this.cpuPaddle = null;
        this.table = null;

        // Game state
        this.gameState = {
            running: false,
            paused: false,
            playerScore: 0,
            cpuScore: 0,
            difficulty: 'medium',
            maxScore: 11
        };

        // Physics
        this.ballVelocity = new THREE.Vector3(0, 0, 0);
        this.ballSpeed = 0.3;
        this.gravity = -0.005;

        // Settings
        this.settings = {
            glassEffect: true,
            liquidEffect: true,
            particles: true,
            bloom: true
        };

        // Particles
        this.particles = [];
        this.particlePool = [];

        // Input
        this.mouse = { x: 0, y: 0 };
        this.keys = {};

        // FPS tracking
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();

        // Difficulty settings
        this.difficultySettings = {
            easy: { cpuSpeed: 0.05, cpuReactionTime: 0.3, ballSpeedMultiplier: 0.8 },
            medium: { cpuSpeed: 0.08, cpuReactionTime: 0.2, ballSpeedMultiplier: 1.0 },
            hard: { cpuSpeed: 0.12, cpuReactionTime: 0.1, ballSpeedMultiplier: 1.2 },
            extreme: { cpuSpeed: 0.18, cpuReactionTime: 0.05, ballSpeedMultiplier: 1.5 }
        };

        this.init();
    }

    async init() {
        this.updateLoadingProgress(10, 'Inicializando escena 3D...');
        await this.sleep(200);

        this.setupScene();
        this.updateLoadingProgress(30, 'Creando efectos de vidrio...');
        await this.sleep(200);

        this.createTable();
        this.updateLoadingProgress(50, 'Generando física líquida...');
        await this.sleep(200);

        this.createPaddles();
        this.updateLoadingProgress(70, 'Configurando iluminación...');
        await this.sleep(200);

        this.createBall();
        this.createLights();
        this.updateLoadingProgress(85, 'Inicializando partículas...');
        await this.sleep(200);

        this.createParticleSystem();
        this.setupEventListeners();
        this.updateLoadingProgress(100, '¡Listo para jugar!');
        await this.sleep(500);

        this.hideLoadingScreen();
        this.animate();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateLoadingProgress(percent, text) {
        const progressBar = document.getElementById('loadingProgress');
        const loadingText = document.getElementById('loadingText');
        if (progressBar) progressBar.style.width = percent + '%';
        if (loadingText) loadingText.textContent = text;
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
        this.scene.fog = new THREE.FogExp2(0x667eea, 0.05);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 12);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    }

    createTable() {
        // Glass table with liquid-like refraction
        const tableGeometry = new THREE.BoxGeometry(15, 0.3, 8);

        // Glass material with advanced properties
        const tableMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4488ff,
            metalness: 0.1,
            roughness: 0.05,
            transparent: true,
            opacity: 0.4,
            transmission: 0.9,
            thickness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            reflectivity: 0.9,
            ior: 1.5,
            envMapIntensity: 1.5
        });

        this.table = new THREE.Mesh(tableGeometry, tableMaterial);
        this.table.position.y = 0;
        this.table.receiveShadow = true;
        this.table.castShadow = true;
        this.scene.add(this.table);

        // Table outline (glowing edges)
        const edgesGeometry = new THREE.EdgesGeometry(tableGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            linewidth: 2
        });
        const tableEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.table.add(tableEdges);

        // Net
        const netGeometry = new THREE.BoxGeometry(0.1, 1, 8);
        const netMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            transmission: 0.5,
            metalness: 0.2,
            roughness: 0.3
        });
        const net = new THREE.Mesh(netGeometry, netMaterial);
        net.position.set(0, 0.65, 0);
        this.scene.add(net);

        // Net glow
        const netGlowGeometry = new THREE.BoxGeometry(0.2, 1.1, 8.2);
        const netGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.1
        });
        const netGlow = new THREE.Mesh(netGlowGeometry, netGlowMaterial);
        net.add(netGlow);

        // Center line
        const lineGeometry = new THREE.PlaneGeometry(15, 0.1);
        const lineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.position.y = 0.16;
        this.scene.add(centerLine);
    }

    createPaddles() {
        // Glass paddle material with liquid effect
        const paddleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff4488,
            metalness: 0.3,
            roughness: 0.1,
            transparent: true,
            opacity: 0.6,
            transmission: 0.7,
            thickness: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            reflectivity: 0.95,
            ior: 1.45
        });

        const cpuPaddleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x44ff88,
            metalness: 0.3,
            roughness: 0.1,
            transparent: true,
            opacity: 0.6,
            transmission: 0.7,
            thickness: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            reflectivity: 0.95,
            ior: 1.45
        });

        const paddleGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.3);

        // Player paddle
        this.playerPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.playerPaddle.position.set(0, 0.3, 5.5);
        this.playerPaddle.castShadow = true;
        this.playerPaddle.receiveShadow = true;
        this.scene.add(this.playerPaddle);

        // Player paddle glow
        const playerGlow = this.createGlowEffect(paddleGeometry, 0xff4488);
        this.playerPaddle.add(playerGlow);

        // CPU paddle
        this.cpuPaddle = new THREE.Mesh(paddleGeometry, cpuPaddleMaterial);
        this.cpuPaddle.position.set(0, 0.3, -5.5);
        this.cpuPaddle.castShadow = true;
        this.cpuPaddle.receiveShadow = true;
        this.scene.add(this.cpuPaddle);

        // CPU paddle glow
        const cpuGlow = this.createGlowEffect(paddleGeometry, 0x44ff88);
        this.cpuPaddle.add(cpuGlow);
    }

    createGlowEffect(geometry, color) {
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const glowMesh = new THREE.Mesh(geometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.2);
        return glowMesh;
    }

    createBall() {
        // Liquid glass ball
        const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const ballMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.2,
            roughness: 0.05,
            transparent: true,
            opacity: 0.8,
            transmission: 0.8,
            thickness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            reflectivity: 1.0,
            ior: 2.0,
            envMapIntensity: 2.0
        });

        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.set(0, 2, 0);
        this.ball.castShadow = true;
        this.ball.receiveShadow = true;
        this.scene.add(this.ball);

        // Ball glow/aura
        const ballGlowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const ballGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const ballGlow = new THREE.Mesh(ballGlowGeometry, ballGlowMaterial);
        this.ball.add(ballGlow);

        // Inner core
        const coreGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.ball.add(core);
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.top = 15;
        directionalLight.shadow.camera.bottom = -15;
        this.scene.add(directionalLight);

        // Point lights for dramatic effect
        const pointLight1 = new THREE.PointLight(0xff0088, 1, 20);
        pointLight1.position.set(-8, 5, 0);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x0088ff, 1, 20);
        pointLight2.position.set(8, 5, 0);
        this.scene.add(pointLight2);

        // Spot lights on paddles
        const spotLight1 = new THREE.SpotLight(0xff4488, 1);
        spotLight1.position.set(0, 5, 5);
        spotLight1.target = this.playerPaddle;
        spotLight1.angle = Math.PI / 6;
        spotLight1.penumbra = 0.3;
        this.scene.add(spotLight1);

        const spotLight2 = new THREE.SpotLight(0x44ff88, 1);
        spotLight2.position.set(0, 5, -5);
        spotLight2.target = this.cpuPaddle;
        spotLight2.angle = Math.PI / 6;
        spotLight2.penumbra = 0.3;
        this.scene.add(spotLight2);
    }

    createParticleSystem() {
        // Pre-create particle pool
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });

        for (let i = 0; i < 100; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
            particle.visible = false;
            this.scene.add(particle);
            this.particlePool.push({
                mesh: particle,
                velocity: new THREE.Vector3(),
                life: 0,
                maxLife: 0
            });
        }
    }

    spawnParticles(position, color, count = 10) {
        if (!this.settings.particles) return;

        for (let i = 0; i < count; i++) {
            const particle = this.particlePool.find(p => !p.mesh.visible);
            if (!particle) continue;

            particle.mesh.position.copy(position);
            particle.mesh.material.color.setHex(color);
            particle.mesh.visible = true;
            particle.velocity.set(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            particle.life = 0;
            particle.maxLife = 30 + Math.random() * 30;

            this.particles.push(particle);
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            particle.mesh.position.add(particle.velocity);
            particle.velocity.y -= 0.01; // Gravity
            particle.life++;

            const lifePercent = particle.life / particle.maxLife;
            particle.mesh.material.opacity = 0.8 * (1 - lifePercent);
            particle.mesh.scale.setScalar(1 - lifePercent * 0.5);

            if (particle.life >= particle.maxLife) {
                particle.mesh.visible = false;
                this.particles.splice(i, 1);
            }
        }
    }

    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Touch movement
        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        });

        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // UI Controls
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.gameState.difficulty = e.target.value;
        });

        // Effect toggles
        document.getElementById('glassEffect').addEventListener('change', (e) => {
            this.settings.glassEffect = e.target.checked;
            this.updateMaterialEffects();
        });

        document.getElementById('liquidEffect').addEventListener('change', (e) => {
            this.settings.liquidEffect = e.target.checked;
            this.updateMaterialEffects();
        });

        document.getElementById('particlesEffect').addEventListener('change', (e) => {
            this.settings.particles = e.target.checked;
        });

        document.getElementById('bloomEffect').addEventListener('change', (e) => {
            this.settings.bloom = e.target.checked;
        });
    }

    updateMaterialEffects() {
        const transmission = this.settings.glassEffect ? 0.8 : 0;
        const opacity = this.settings.glassEffect ? 0.6 : 1;

        this.playerPaddle.material.transmission = transmission;
        this.playerPaddle.material.opacity = opacity;
        this.cpuPaddle.material.transmission = transmission;
        this.cpuPaddle.material.opacity = opacity;
        this.ball.material.transmission = transmission;
        this.ball.material.opacity = this.settings.glassEffect ? 0.8 : 1;
        this.table.material.transmission = this.settings.glassEffect ? 0.9 : 0.3;
    }

    startGame() {
        if (!this.gameState.running) {
            this.gameState.running = true;
            this.gameState.paused = false;
            this.resetBall();
        }
    }

    togglePause() {
        if (this.gameState.running) {
            this.gameState.paused = !this.gameState.paused;
        }
    }

    resetGame() {
        this.gameState.playerScore = 0;
        this.gameState.cpuScore = 0;
        this.updateScore();
        this.resetBall();
        this.gameState.running = false;
        this.gameState.paused = false;
    }

    resetBall() {
        this.ball.position.set(0, 2, 0);

        const difficulty = this.difficultySettings[this.gameState.difficulty];
        const angle = (Math.random() - 0.5) * Math.PI / 4;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const speed = this.ballSpeed * difficulty.ballSpeedMultiplier;

        this.ballVelocity.set(
            Math.sin(angle) * speed,
            0,
            Math.cos(angle) * speed * direction
        );
    }

    updateScore() {
        document.getElementById('playerScore').textContent = this.gameState.playerScore;
        document.getElementById('cpuScore').textContent = this.gameState.cpuScore;
    }

    updatePlayerPaddle() {
        // Mouse/Touch control
        const targetX = this.mouse.x * 6;
        this.playerPaddle.position.x += (targetX - this.playerPaddle.position.x) * 0.15;

        // Keyboard control
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.playerPaddle.position.x -= 0.2;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.playerPaddle.position.x += 0.2;
        }

        // Clamp position
        this.playerPaddle.position.x = Math.max(-6.5, Math.min(6.5, this.playerPaddle.position.x));
    }

    updateCPUPaddle() {
        if (!this.gameState.running || this.gameState.paused) return;

        const difficulty = this.difficultySettings[this.gameState.difficulty];

        // Only react when ball is moving towards CPU
        if (this.ballVelocity.z < 0) {
            const targetX = this.ball.position.x;
            const diff = targetX - this.cpuPaddle.position.x;

            // Add some randomness based on difficulty
            const reaction = diff * difficulty.cpuReactionTime;

            this.cpuPaddle.position.x += Math.max(-difficulty.cpuSpeed, Math.min(difficulty.cpuSpeed, reaction));
        }

        // Clamp position
        this.cpuPaddle.position.x = Math.max(-6.5, Math.min(6.5, this.cpuPaddle.position.x));
    }

    updateBall() {
        if (!this.gameState.running || this.gameState.paused) return;

        // Apply velocity
        this.ball.position.add(this.ballVelocity);

        // Gravity and liquid effect
        if (this.settings.liquidEffect) {
            this.ballVelocity.y += this.gravity;
        }

        // Table bounce
        if (this.ball.position.y < 0.45 && this.ballVelocity.y < 0) {
            this.ball.position.y = 0.45;
            this.ballVelocity.y *= -0.8; // Bounce with damping
            this.spawnParticles(this.ball.position.clone(), 0x4488ff, 15);
        }

        // Side walls
        if (Math.abs(this.ball.position.x) > 7.2) {
            this.ballVelocity.x *= -1;
            this.ball.position.x = Math.sign(this.ball.position.x) * 7.2;
            this.spawnParticles(this.ball.position.clone(), 0xffffff, 10);
        }

        // Paddle collision - Player
        if (this.ball.position.z > 5.2 && this.ball.position.z < 5.8 &&
            Math.abs(this.ball.position.x - this.playerPaddle.position.x) < 1.0 &&
            this.ballVelocity.z > 0) {

            this.ballVelocity.z *= -1.05; // Return with slight speed increase
            const offset = (this.ball.position.x - this.playerPaddle.position.x) / 1.0;
            this.ballVelocity.x = offset * 0.3;
            this.ballVelocity.y = 0.2; // Add upward velocity
            this.spawnParticles(this.ball.position.clone(), 0xff4488, 20);

            // Paddle animation
            this.playerPaddle.scale.z = 0.7;
        }

        // Paddle collision - CPU
        if (this.ball.position.z < -5.2 && this.ball.position.z > -5.8 &&
            Math.abs(this.ball.position.x - this.cpuPaddle.position.x) < 1.0 &&
            this.ballVelocity.z < 0) {

            this.ballVelocity.z *= -1.05;
            const offset = (this.ball.position.x - this.cpuPaddle.position.x) / 1.0;
            this.ballVelocity.x = offset * 0.3;
            this.ballVelocity.y = 0.2;
            this.spawnParticles(this.ball.position.clone(), 0x44ff88, 20);

            // Paddle animation
            this.cpuPaddle.scale.z = 0.7;
        }

        // Paddle scale reset
        this.playerPaddle.scale.z += (1 - this.playerPaddle.scale.z) * 0.1;
        this.cpuPaddle.scale.z += (1 - this.cpuPaddle.scale.z) * 0.1;

        // Score points
        if (this.ball.position.z > 8) {
            this.gameState.cpuScore++;
            this.updateScore();
            this.resetBall();
            this.spawnParticles(new THREE.Vector3(0, 1, 6), 0x44ff88, 50);
            this.checkGameOver();
        }

        if (this.ball.position.z < -8) {
            this.gameState.playerScore++;
            this.updateScore();
            this.resetBall();
            this.spawnParticles(new THREE.Vector3(0, 1, -6), 0xff4488, 50);
            this.checkGameOver();
        }

        // Ball rotation
        this.ball.rotation.x += this.ballVelocity.z * 0.1;
        this.ball.rotation.z -= this.ballVelocity.x * 0.1;

        // Update speed display
        const speed = this.ballVelocity.length();
        document.getElementById('ballSpeed').textContent = (speed * 100).toFixed(0);
    }

    checkGameOver() {
        if (this.gameState.playerScore >= this.gameState.maxScore) {
            alert('¡Ganaste! 🎉');
            this.resetGame();
        } else if (this.gameState.cpuScore >= this.gameState.maxScore) {
            alert('¡CPU Ganó! Intenta de nuevo. 😔');
            this.resetGame();
        }
    }

    updateFPS() {
        this.frameCount++;
        const currentTime = performance.now();

        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            document.getElementById('fps').textContent = this.fps;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updatePlayerPaddle();
        this.updateCPUPaddle();
        this.updateBall();
        this.updateParticles();
        this.updateFPS();

        // Animate table (liquid wave effect)
        if (this.settings.liquidEffect) {
            this.table.rotation.y += 0.001;
            this.table.material.opacity = 0.4 + Math.sin(Date.now() * 0.001) * 0.05;
        }

        // Camera subtle movement
        this.camera.position.x = Math.sin(Date.now() * 0.0002) * 0.5;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new PingPong3D();
});
