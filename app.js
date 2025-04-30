const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameOverDisplay = document.getElementById('gameOver');

// Game objects
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 10,
    dx: 4,
    dy: -4
};

let paddle = {
    width: 100,
    height: 10,
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    speed: 8
};

let bricks = [];
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;

let score = 0;
let lives = 3;
let rightPressed = false;
let leftPressed = false;
let gameOver = false;

// Initialize bricks
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'r' || e.key === 'R') {
        if (gameOver) resetGame();
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ball.x > b.x && ball.x < b.x + brickWidth &&
                    ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score += 10;
                    scoreDisplay.textContent = `Score: ${score}`;
                    if (score === brickRowCount * brickColumnCount * 10) {
                        alert('You Win!');
                        resetGame();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#0f0';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#f00';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function moveBall() {
    if (gameOver) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        livesDisplay.textContent = `Lives: ${lives}`;
        if (lives === 0) {
            gameOver = true;
            gameOverDisplay.style.display = 'block';
        } else {
            ball.x = canvas.width / 2;
            ball.y = canvas.height - 50;
            ball.dx = 4;
            ball.dy = -4;
            paddle.x = canvas.width / 2 - paddle.width / 2;
        }
    }

    // Paddle collision
    if (ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
    }
}

function movePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    }
    if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

function resetGame() {
    score = 0;
    lives = 3;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    gameOver = false;
    gameOverDisplay.style.display = 'none';
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.dx = 4;
    ball.dy = -4;
    paddle.x = canvas.width / 2 - paddle.width / 2;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    moveBall();
    movePaddle();
    if (!gameOver) requestAnimationFrame(draw);
}

draw();