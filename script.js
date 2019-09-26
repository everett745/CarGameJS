const score = document.querySelector('.score span'),
    topScore = document.querySelector('.localStorage span'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');


car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3  
};

const cars = {
    1: 'url(./image/enemy.png)',
    2: 'url(./image/enemy2.png)',
    3: 'url(./image/player.png)'
};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
    if(event.target.tagName == "DIV") {return 0;}

    switch (event.target.dataset.diff) {
        case 'easy': setting.speed = 3; setting.traffic = 4; break;
        case 'middle': setting.speed = 6; setting.traffic = 3; break;
        case 'hard': setting.speed = 9; setting.traffic = 2; break;
    }

    startMusic();

    start.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.cssText = 'left: 125px; bottom: 10px;';

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        let rndCar = Math.round(Math.random() * 4) - 1;
        enemy.style.background = "transparent " + cars[rndCar] + " center / cover no-repeat";
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);

    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;

    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed;
        score.textContent = setting.score;
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
        }
        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }

        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }
        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - 100)){
            setting.y += setting.speed;
        }

        car.style.top = setting.y + 'px';
        car.style.left = setting.x + 'px';

        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach((line) => {
        line.y += setting.speed;
        if(line.y >= document.documentElement.clientHeight){
            line.y = -100;
        }
        line.style.top = line.y;
    });
}

function moveEnemy() {
    const enemy = document.querySelectorAll('.enemy');

    enemy.forEach(element => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = element.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom && 
            carRect.right >= enemyRect.left && 
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top){
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight * 2 + 'px';
            printTopResult();
            stopMusic();
        }

        element.y += setting.speed / 1.5;
        element.style.top = element.y;
        if(element.y >= document.documentElement.clientHeight){
            let rndCar = Math.floor(Math.random() * 4) - 1;
            element.style.background = "transparent " + cars[rndCar] + " center / cover no-repeat";
            element.style.left = Math.round(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            element.y = -100 * setting.traffic;
        }
    });
}

function printTopResult() {
    if(parseInt(topScore.textContent) < parseInt(score.textContent)){
        topScore.textContent = score.textContent;
        score.innerHTML = "Новый рекорд: " + score.textContent;
    }
}

var startAudio = new Audio();
var stopAudio = new Audio();
function startMusic() {
    stopAudio.pause();

    startAudio.src = './sound/Start.mp3'; // Указываем путь к звуку "клика"
    startAudio.autoplay = true; // Автоматически запускаем
}

function stopMusic() {
    stopAudio.src = './sound/Stop.mp3';
    stopAudio.autoplay = true;

    startAudio.pause();
}