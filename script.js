const currentScore = document.getElementById("score");
const start = document.getElementById("start");
const scoreDisplay = document.getElementById("score");
const GameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");



const scale = 20;
const [rows, columns] = [canvas.height/scale, canvas.width/scale];
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let speed = 250; // let чтобы потом при шифте была возможность ускорения
let score = 0;


class Snake {
    constructor() {
        this.body = [
            {x: 5, y: 5},
            {x: 4, y: 5},
        ];
    }

    update() {
        const head = {...this.body[0]};
        head.x += direction.x;
        head.y += direction.y;
        this.body.unshift(head);

        if (head.x === fruit.x && head.y === fruit.y) {
            score ++;
            currentScore.innerHTML = score;
            placeFruit();
        } else {
            this.body.pop();
        }
    }

    coloring () {
        this.body.forEach((segment, i) => {
            ctx.fillStyle = i === 0 ? "#FF7559" : "#FFF38A";
            ctx.beginPath();
            ctx.roundRect(
                segment.x * scale + 2,
                segment.y * scale + 2,
                scale-4,
                scale-4,
                6
            );
            ctx.fill();
        })
    }

    collisionCheck() {
        const [head, ...body] = this.body;
        return (
            head.x < 0 || head.y < 0 ||
            head.y >= rows || head.x >= columns ||
            body.some((seg) => seg.x === head.x && seg.y === head.y)
        )
    }
}

let snake;
let fruit;

function placeFruit() {
    fruit = {
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows),
    }

    if (snake.body.some((s) => s.x === fruit.x && s.y === fruit.y)) {
        placeFruit();
    }
}

function coloringFruit() {
    ctx.fillStyle = "#59FF75";
    ctx.beginPath();
    ctx.roundRect(
        fruit.x * scale + 2,
        fruit.y * scale + 2,
        scale - 4,
        scale - 4,
        6
    );
    ctx.fill();
}

let playing = false;
let lastTime = 0;

function gameLoop(time = 0) {
    if (!playing) return 0;
    const delta = time - lastTime;
    if (delta > speed) {
        direction = nextDirection;
        snake.update();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (snake.collisionCheck()) {
            endGame();
            return;
        }

        snake.coloring();
        coloringFruit();
        lastTime = time;
    }
    requestAnimationFrame(gameLoop);
}

const directions = {
    ArrowUp: () => {if (direction.y !== 1) nextDirection = { x: 0, y: -1 };},
    ArrowDown: () => {if (direction.y !== -1) nextDirection = { x: 0, y: 1 };},
    ArrowLeft: () => {if (direction.x !== 1) nextDirection = { x: -1, y: 0 };},
    ArrowRight: () => {if (direction.x !== -1) nextDirection = { x: 1, y: 0 };},

    KeyW: () => {if (direction.y !== 1) nextDirection = { x: 0, y: -1 };},
    KeyS: () => {if (direction.y !== -1) nextDirection = { x: 0, y: 1 };},
    KeyA: () => {if (direction.x !== 1) nextDirection = { x: -1, y: 0 };},
    KeyD: () => {if (direction.x !== -1) nextDirection = { x: 1, y: 0 };},
}

document.addEventListener("keydown", (e) => {
    if (directions[e.code]) directions[e.code]();
})

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
})

document.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) directions.ArrowRight();
        else directions.ArrowLeft();
    } else {
        if (dy > 0) directions.ArrowDown();
        else directions.ArrowUp();
    }
})

function endGame() {
    playing = false;
    canvas.style.display = "none";
    scoreDisplay.style.display = "none";
    GameOverScreen.style.display = "flex";

    finalScore.textContent = `Итоговый счет: ${score}`;
}

start.addEventListener("click", () => {
    snake = new Snake();
    score = 0;
    currentScore.textContent = score;
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    playing = true;
    lastTime = 0;
    canvas.style.display = "block";
    scoreDisplay.style.display = "block";
    GameOverScreen.style.display = "none";
    placeFruit();
    gameLoop();
});