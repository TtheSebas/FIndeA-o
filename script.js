// --- CONFIGURACIÓN ---
const countDate = new Date().getTime() + 5000;
let isPartyStarted = false;

const sentences = [
    "Que este nuevo comienzo logres todo lo que te propones.",
    "365 nuevas oportunidades para no cagarla 😅😅😅 .",
    "Te agradezco por los momentos compartidos y risas de por medio.",
    "Te deseo todo lo mejor.",
    "Y que este nuevo año este lleno de buenos recuerdos "
];
let textIndex = 0;

// --- LÓGICA DEL CONTADOR ---
function updateCountdown() {
    if (isPartyStarted) return;
    const now = new Date().getTime();
    const gap = countDate - now;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    if (gap <= 0) {
        // ¡CAMBIO IMPORTANTE!
        // Cuando el tiempo llega a 0, NO empieza la fiesta automática.
        // Detenemos el reloj y mostramos el botón.
        clearInterval(timerInterval);
        document.getElementById('d').innerText = "00";
        document.getElementById('h').innerText = "00";
        document.getElementById('m').innerText = "00";
        document.getElementById('s').innerText = "00";
        showButton(); 
    } else {
        document.getElementById('d').innerText = d < 10 ? '0' + d : d;
        document.getElementById('h').innerText = h < 10 ? '0' + h : h;
        document.getElementById('m').innerText = m < 10 ? '0' + m : m;
        document.getElementById('s').innerText = s < 10 ? '0' + s : s;
    }
}

// Nueva función que solo muestra el botón
function showButton() {
    const countdown = document.getElementById('countdown-container');
    const btn = document.getElementById('celebrateBtn');
    
    // Ocultar contador suavemente
    countdown.style.opacity = "0";
    setTimeout(() => {
        countdown.classList.add('hidden');
        // Mostrar botón
        btn.classList.remove('hidden');
    }, 500);
}

// --- FUNCIÓN PRINCIPAL DE INICIO (Se activa al dar click al botón) ---
function startParty() {
    if (isPartyStarted) return;
    isPartyStarted = true;

    // 1. Ocultar el botón que acabamos de presionar
    const btn = document.getElementById('celebrateBtn');
    btn.style.transform = "scale(0)";
    setTimeout(() => { btn.classList.add('hidden'); }, 300);

    // 2. REPRODUCIR AUDIO (Ahora sí, 100% garantizado porque hubo clic)
    var audio = document.getElementById('partyAudio');
    audio.play().catch(function(error) {
        console.log("Error al reproducir: " + error);
    });

    // 3. Mostrar el mensaje y empezar la pirotecnia
    setTimeout(() => {
        document.getElementById('mainFrame').classList.add('active');
        changeText();
        setInterval(changeText, 4000);
        intensifyParticles(); 

        initFireworksCanvas();
        animateFireworks();
        setInterval(launchRandomFirework, 800);
        launchRandomFirework(); launchRandomFirework();
    }, 500);
}

function changeText() {
    const display = document.getElementById('text-display');
    display.style.opacity = 0;
    setTimeout(() => {
        display.innerText = sentences[textIndex];
        display.style.opacity = 1;
        textIndex = (textIndex + 1) % sentences.length;
    }, 500);
}

// --- FONDO BOKEH ---
const bokehContainer = document.getElementById('bokeh');
const bokehColors = ['#FFD700', '#FF4500', '#00FFFF', '#FFFFFF'];

function createParticles(count, speedMultiplier) {
    for (let i = 0; i < count; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        const size = Math.random() * 15 + 5;
        light.style.width = size + 'px';
        light.style.height = size + 'px';
        light.style.left = Math.random() * 100 + '%';
        light.style.setProperty('--color', bokehColors[Math.floor(Math.random() * bokehColors.length)]);
        const duration = (Math.random() * 10 + 5) / speedMultiplier;
        light.style.setProperty('--duration', duration + 's');
        light.style.animationDelay = Math.random() * 5 + 's';
        bokehContainer.appendChild(light);
    }
}
function intensifyParticles() { createParticles(40, 2); }


// --- PIROTECNIA 3D ---
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let fireworksParticles = [];
const fireworkColors = ['#FFD700', '#C0C0C0', '#FF4500', '#00BFFF', '#FF69B4', '#FFFFFF'];

function initFireworksCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = Math.random() * 3 + 1;
        this.gravity = 0.05; 
        this.friction = 0.98;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01; 
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function launchRandomFirework() {
    const x = Math.random() * canvasWidth;
    const y = Math.random() * (canvasHeight / 2) + (canvasHeight * 0.1);
    const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
    createExplosion(x, y, color);
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 80; i++) {
        fireworksParticles.push(new FireworkParticle(x, y, color));
    }
}

function animateFireworks() {
    ctx.fillStyle = 'rgba(2, 2, 16, 0.2)'; 
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = fireworksParticles.length - 1; i >= 0; i--) {
        fireworksParticles[i].update();
        fireworksParticles[i].draw(ctx);

        if (fireworksParticles[i].alpha <= 0) {
            fireworksParticles.splice(i, 1);
        }
    }
    requestAnimationFrame(animateFireworks);
}

// INICIO AUTOMÁTICO
createParticles(30, 1);
timerInterval = setInterval(updateCountdown, 1000);
updateCountdown();