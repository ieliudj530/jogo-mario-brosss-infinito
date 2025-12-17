const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart');

let score = 0;
let gameOver = false;

const jump = () => {
    if (!gameOver) {
        mario.classList.add('jump');

        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
};

// SCORE
const scoreLoop = setInterval(() => {
    if (!gameOver) {
        score++;
        scoreElement.innerText = score;
    }
}, 100);

// GAME LOOP
const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario)
        .bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
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
}, 10);

// RESTART
restartBtn.addEventListener('click', () => {
    location.reload();
});

document.addEventListener('keydown', jump);
