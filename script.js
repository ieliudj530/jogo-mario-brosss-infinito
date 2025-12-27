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
            
            // Asegurar que el video siga reproduciéndose
            video.play().catch(() => {
                // Ignorar errores si el video no puede reproducirse
            });
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
    const touch = e.touches && e.touches[0];
    const target = touch ? document.elementFromPoint(touch.clientX, touch.clientY) : e.target;

    // If touching buttons, let them handle the click (don't prevent default)
    if (playBtn.contains(target) || restartBtn.contains(target)) {
        return;
    }

    // For game-area touches, prevent default and handle actions
    e.preventDefault();
    
    // If game is over, any touch restarts
    if (gameOver) {
        location.reload();
        return;
    }

    if (!gameStarted) {
        playBtn.click();
        // also perform an immediate jump on first touch
        setTimeout(() => jump(), 50);
        return;
    }

    // if game already started, perform jump
    jump();
}, { passive: false });

// Mouse click: click/tap with mouse should start game (if needed), jump, or restart (if game over)
document.addEventListener('click', (e) => {
    // Let buttons handle their own clicks
    if (playBtn.contains(e.target) || restartBtn.contains(e.target)) return;
    
    // If game is over, any click restarts
    if (gameOver) {
        location.reload();
        return;
    }

    if (!gameStarted) {
        playBtn.click();
        // small delay to ensure game started before jump
        setTimeout(() => jump(), 50);
        return;
    }

    jump();
});
