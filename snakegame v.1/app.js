const gameBoard = document.getElementById('gameBoard');
const context = gameBoard.getContext('2d');
const scoreText = document.getElementById('scoreVal');
const WIDTH = gameBoard.width;
const HEIGHT = gameBoard.height;
const unit = 25;

let foodX;
let foodY;
let powerUpX;
let powerUpY;
let xvel = unit;
let yvel = 0;
let score = 0;
let active = true;
let started = false;
let powerUpActive = false;
let powerUpTimer;
let snakeSpeed = 200; // Initial speed


let snake = [
    {x: unit*3, y: 0},
    {x: unit*2, y: 0},
    {x: unit, y: 0},
    {x: 0, y: 0}
];

window.addEventListener('keydown', keypress);
startGame();

function startGame(){
    context.fillStyle = '#212121';
    context.fillRect(0, 0, WIDTH, HEIGHT);
    createFood();
    createPowerUp();
    displayFood();
    drawSnake();
}

function clearBoard(){
    context.fillStyle = '#212121';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function createFood(){
    foodX = Math.floor(Math.random() * (WIDTH / unit)) * unit;
    foodY = Math.floor(Math.random() * (HEIGHT / unit)) * unit;
}

function displayFood(){
    context.fillStyle = 'red';
    context.fillRect(foodX, foodY, unit, unit);
    context.shadowColor = 'rgba(255, 0, 0, 0.5)';
    context.shadowBlur = 20;
    context.fillRect(foodX, foodY, unit, unit);
    context.shadowBlur = 0;
}

function createPowerUp(){
    powerUpX = Math.floor(Math.random() * (WIDTH / unit)) * unit;
    powerUpY = Math.floor(Math.random() * (HEIGHT / unit)) * unit;
}

function displayPowerUp(){
    if (!powerUpActive) return;
    context.fillStyle = 'blue';
    context.fillRect(powerUpX, powerUpY, unit, unit);
    context.shadowColor = 'rgba(0, 0, 255, 0.5)';
    context.shadowBlur = 20;
    context.fillRect(powerUpX, powerUpY, unit, unit);
    context.shadowBlur = 0;
}

function drawSnake(){
    snake.forEach((snakePart, index) => {
        context.fillStyle = index === 0 ? '#32cd32' : '#6b8e23';
        context.fillRect(snakePart.x, snakePart.y, unit, unit);
        context.strokeStyle = '#212121';
        context.strokeRect(snakePart.x, snakePart.y, unit, unit);
        
        // Add animation class for tail parts
        if (index !== 0) {
            context.globalAlpha = 0.75 - (index * 0.1);
            context.shadowColor = 'rgba(50, 205, 50, 0.5)';
            context.shadowBlur = 15;
            context.fillRect(snakePart.x, snakePart.y, unit, unit);
            context.globalAlpha = 1.0;
            context.shadowBlur = 0;
        }
    });
}


function moveSnake(){
    const head = {x: snake[0].x + xvel, y: snake[0].y + yvel};
    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;
        animateFoodEaten(); // Call the animation function
        createFood();
    } else {
        snake.pop();
    }

    if (snake[0].x === powerUpX && snake[0].y === powerUpY) {
        activatePowerUp();
        clearTimeout(powerUpTimer);
        powerUpActive = false;
        powerUpTimer = setTimeout(() => {
            createPowerUp();
            powerUpActive = true;
        }, 10000);
    }
}


function nextTick(){
    if (active) {
        setTimeout(() => {
            clearBoard();
            displayFood();
            displayPowerUp();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, snakeSpeed);
    } else {
        clearBoard();
        context.font = "bold 50px serif";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.fillText("Game Over!!", WIDTH / 2, HEIGHT / 2);
        pauseMenu.classList.remove('hidden');
    }
}

function animateFoodEaten() {
    const originalColor = context.fillStyle;
    context.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Golden color for glow
    context.shadowColor = 'rgba(255, 215, 0, 0.5)';
    context.shadowBlur = 20;
    context.fillRect(foodX, foodY, unit, unit);
    context.shadowBlur = 0;
    context.fillStyle = originalColor;
}



function keypress(event){
    if (!started) {
        started = true;
        nextTick();
    }

    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    switch(true){
        case(event.keyCode == left && xvel != unit):
            xvel = -unit;
            yvel = 0;
            break;
        case(event.keyCode == right && xvel != -unit):
            xvel = unit;
            yvel = 0;
            break;
        case(event.keyCode == up && yvel != unit):
            xvel = 0;
            yvel = -unit;
            break;
        case(event.keyCode == down && yvel != -unit):
            xvel = 0;
            yvel = unit;
            break;
    }
}

function checkGameOver(){
    switch(true){
        case(snake[0].x < 0):
        case(snake[0].x >= WIDTH):
        case(snake[0].y < 0):
        case(snake[0].y >= HEIGHT):
            active = false;
            break;
    }
}

// Power-up activation
function activatePowerUp() {
    // Example power-up: temporarily increase speed
    clearTimeout(powerUpTimer);
    const originalSpeed = xvel;
    xvel *= 2;
    setTimeout(() => xvel = originalSpeed, 5000); // Power-up lasts for 5 seconds
}
