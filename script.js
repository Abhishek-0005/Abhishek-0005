const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const bike = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 30,
    speed: 5
};

function update() {
    bike.x += bike.speed;
    if (bike.x > canvas.width) {
        bike.x = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(bike.x, bike.y, bike.width, bike.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();