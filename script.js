const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart');
const playBtn = document.getElementById('play');
const video = document.getElementById('video');

let score = 0;
let gameOver = false;
let gameStarted = false;
let pipesPassed = 0;

const jump = () => {
    if (!gameOver) {
        mario.classList.add('jump');

        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
};

// VIDEO PLAY DETECTION
video.addEventListener('play', () => {
    if (gameStarted && playBtn.style.display !== 'none') {
        playBtn.style.display = 'none';
    }
});

// PLAY BUTTON
playBtn.addEventListener('click', () => {
    gameStarted = true;
    playBtn.style.display = 'none';
    
    // Reanudar animaciones
    pipe.style.animationPlayState = 'running';
    document.querySelector('.cloud').style.animationPlayState = 'running';
    
    video.play();
});

// SCORE
let scoreLoop;

const startScoreLoop = () => {
    scoreLoop = setInterval(() => {
        if (!gameOver && gameStarted) {
            score++;
            scoreElement.innerText = score;
        }
    }, 100);
};

startScoreLoop();

// GAME LOOP
let loop;

const startGameLoop = () => {
    loop = setInterval(() => {
        if (!gameStarted) {
            return;
        }

        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario)
            .bottom.replace('px', '');
        
        const marioWidth = mario.offsetWidth;
        const pipeWidth = pipe.offsetWidth;
        const marioHeight = 100;

        // Detectar colisión
        if (pipePosition <= marioWidth && pipePosition > -pipeWidth && marioPosition < 80) {
            gameOver = true;

            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;

            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;

            mario.src = 'imgs/game-over.png';

            restartBtn.style.display = 'block';

            clearInterval(loop);
            clearInterval(scoreLoop);
        }

        // Detectar cuando Mario salta exitosamente sobre el pipe
        if (pipePosition < -pipeWidth && pipesPassed === 0) {
            pipesPassed = 1;
            // El score ya se está sumando en el scoreLoop
        }

        // Resetear cuando el pipe vuelve a aparecer
        if (pipePosition > 0) {
            pipesPassed = 0;
        }
    }, 10);
};

startGameLoop();

// RESTART
restartBtn.addEventListener('click', () => {
    location.reload();
});

// Keyboard: spacebar to jump (desktop)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

// Touch: tap the screen to start the game (first touch) or jump (if already started)
document.addEventListener('touchstart', (e) => {
    // Determine actual target of the touch (handle elements inside buttons)
    const touch = e.touches && e.touches[0];
    const target = touch ? document.elementFromPoint(touch.clientX, touch.clientY) : e.target;

    // If touching the play or restart buttons, let their click handlers run
    if (target === playBtn || target === restartBtn || (target && (playBtn.contains(target) || restartBtn.contains(target)))) {
        // call restart directly on restart touch to avoid prevented click
        if (target === restartBtn || (target && restartBtn.contains(target))) {
            restartBtn.click();
        }
        return;
    }

    // For other touches, prevent default scrolling and act as game control
    e.preventDefault();
    if (gameOver) return;

    if (!gameStarted) {
        playBtn.click();
        // also perform an immediate jump on first touch
        setTimeout(() => jump(), 50);
        return;
    }

    // if game already started, perform jump
    jump();
}, { passive: false });

// Mouse click: click/tap with mouse should start game (if needed) or jump
document.addEventListener('click', (e) => {
    // ignore clicks on control buttons
    if (e.target === playBtn || e.target === restartBtn) return;
    if (gameOver) return;

    if (!gameStarted) {
        playBtn.click();
        // small delay to ensure game started before jump
        setTimeout(() => jump(), 50);
        return;
    }

    jump();
});
