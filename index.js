// Создаем фон
let backgroundImage = new Image()
let kremlinImage = new Image()
let cathedralImage = new Image()

let expX = 0
let expY = 0

// Создаем поле для игры
let GAME = {
    width: 600,
    height: 300,
    background: '#f5f0e1',
    level: 1,
    life: 3,
    score: 0
}

// Создаем снаряд
let BALL = {
    color: '#ff6e40',
    x: 20,
    y: 290,
    radius: 3,
    xDirection: 4,
    yDirection: -4
}

// Создаем танк с пушкой
let TANK = {
    color: 'green',
    radius: 20,
    x: 20,
    y: 290,
    gunAngle: 1.7,
}

// Создаем вражеский танк
let ENEMY = {
    color: 'grey',
    height: 20,
    width: 30,
    x: 500,
    y: 10 + Math.random() * 260,
    yDirection: 0,
    xDirection: -0.5,
    xDefaultDirection: -0.5,
    gunLength: 50,
    gunWidth: 10,
    trackLength: 50,
    trackWidth: 10
}

// Анимация взрыва
let ANIMATION = {
    img: new Image(),      
    imgIsLoad: false,      
    count: 0, 
    tick: 0,             
    explosion: false,      
    size: 80,
    x: 0,
    y: 0             
}

let isMoving = false

let canvas = document.getElementById('canvas')
canvas.height = GAME.height
canvas.width = GAME.width
let canvasContext = canvas.getContext('2d')

// Функция перелистывания кадров
function play() {
    drawFrame()
    updateBall()
    updateEnemy()
    drawGameData()
}

// функция отрисовки кадра
function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height)
    drawBackground()
    drawBall()   
    drawTankGun()
    drawTank()
    drawEnemy()
    isMoving ? requestAnimationFrame(play) : cancelAnimationFrame(play)
}

// рисуем фон
function drawBackground() {
    canvasContext.fillStyle = GAME.background
    canvasContext.fillRect(0, 0, GAME.width, GAME.height)
    canvasContext.drawImage(backgroundImage, 0, 0)
    canvasContext.drawImage(kremlinImage, 0, 0)
    canvasContext.drawImage(cathedralImage, 0, 125)
}

// Инициализация фона и объектов
function initBackground() {
    backgroundImage.src = './images/background.jpg'
    kremlinImage.src = './images/kremlin.png'
    cathedralImage.src = './images/cathedral.png'
    backgroundImage.onload = () => {
        canvasContext.drawImage(backgroundImage, 0, 0)
        if (!isMoving) {
            drawStartScreen()
        }   
    }
    kremlinImage.onload = () => {
        canvasContext.drawImage(kremlinImage, 0, 0)
    }
    cathedralImage.onload = () => {
        canvasContext.drawImage(cathedralImage, 0, 125)
    }
}

// Инициализация анимации взрыва
function initAnimation() {
    ANIMATION.img.src = "./images/explosion.png"
    ANIMATION.img.onload = () => {
        ANIMATION.imgIsLoad = true
    }
}
 
// Функция отрисовки анимации
function drawAnimation() {
    if (ANIMATION.imgIsLoad && ANIMATION.explosion) {
        canvasContext.drawImage(
            ANIMATION.img, 
            ANIMATION.count * ANIMATION.size,
            0,
            ANIMATION.size,
            ANIMATION.size,

            ANIMATION.x - 40,
            ANIMATION.y - 40,
            ANIMATION.size,
            ANIMATION.size)
    }
    requestAnimationFrame(drawAnimation)

    ANIMATION.tick += 1
    if (ANIMATION.tick === 8) {
        ANIMATION.count += 1
        ANIMATION.tick = 0
    }
    if (ANIMATION.count === 9) {
        ANIMATION.count = 0
        ANIMATION.explosion = false
    }
}

// функция отрисовки снаряда
function drawBall() {
    canvasContext.fillStyle = BALL.color
    canvasContext.strokeStyle = 'red'
    canvasContext.lineWidth = 1
    canvasContext.beginPath()
    canvasContext.arc(BALL.x, BALL.y, BALL.radius, 0, 2*Math.PI)
    canvasContext.fill()
    canvasContext.stroke()
}

// функция отрисовки танка
function drawTank() {
    canvasContext.fillStyle = TANK.color
    canvasContext.strokeStyle = 'darkgreen'
    canvasContext.lineWidth = 3
    canvasContext.beginPath()
    canvasContext.arc(TANK.x, TANK.y, TANK.radius, 0.9*Math.PI, 0.1*Math.PI)
    canvasContext.fill()
    canvasContext.stroke()
}

// функция отрисовки пушки танка
function drawTankGun() {
    canvasContext.strokeStyle = 'darkgreen'
    canvasContext.lineWidth = TANK.radius * 2
    canvasContext.beginPath()
    canvasContext.arc(TANK.x, TANK.y, TANK.radius, TANK.gunAngle*Math.PI, (TANK.gunAngle + 0.1)*Math.PI)
    canvasContext.stroke()
}

function drawEnemy() {
    canvasContext.beginPath()
    canvasContext.fillStyle = ENEMY.color
    canvasContext.strokeStyle = 'black'
    canvasContext.lineWidth = 3
    canvasContext.rect(ENEMY.x, ENEMY.y, ENEMY.width, ENEMY.height)
    canvasContext.rect(ENEMY.x - 20, ENEMY.y + 5, 20, ENEMY.gunWidth)
    canvasContext.rect(ENEMY.x - 10, ENEMY.y - ENEMY.gunWidth, ENEMY.gunLength, ENEMY.gunWidth)
    canvasContext.rect(ENEMY.x - 10, ENEMY.y + ENEMY.height, ENEMY.gunLength, ENEMY.gunWidth)
    canvasContext.fill()
    canvasContext.stroke()
}

function drawVictoryScreen() {
    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.5)'
    canvasContext.fillRect(50, 50, GAME.width - 100, GAME.height - 100)

    canvasContext.font = '96px Arial'
    canvasContext.fillStyle = BALL.color
    canvasContext.textAlign = 'center'
    canvasContext.fillText('VICTORY', GAME.width / 2, GAME.height / 2)
    
    canvasContext.font = '24px Arial'
    canvasContext.fillStyle = BALL.color
    canvasContext.textAlign = 'center'
    canvasContext.fillText('Press <SPACE> to restart', GAME.width / 2, GAME.height / 1.5)
}

function drawDefeatScreen() {
    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.5)'
    canvasContext.fillRect(50, 50, GAME.width - 100, GAME.height - 100)

    canvasContext.font = '96px Arial'
    canvasContext.fillStyle = 'black'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('DEFEAT', GAME.width / 2, GAME.height / 2)
    
    canvasContext.font = '24px Arial'
    canvasContext.fillStyle = 'black'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('Press <SPACE> to restart', GAME.width / 2, GAME.height / 1.5)
}

function drawStartScreen() {
    canvasContext.fillStyle = 'rgba(207, 37, 37, 0.5)'
    canvasContext.fillRect(50, 50, GAME.width - 100, GAME.height - 100)

    canvasContext.font = '16px Arial'
    canvasContext.fillStyle = 'bisque'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('https://github.com/DmitriiOS - dsorlov86@gmail.com', GAME.width / 2, GAME.height / 4)


    canvasContext.font = '48px Arial'
    canvasContext.fillStyle = 'white'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('BATTLE for MOSCOW', GAME.width / 2, GAME.height / 2)
    
    canvasContext.font = '16px Arial'
    canvasContext.fillStyle = 'bisque'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('Press ⇧ and ⇩ to control the gun', GAME.width / 2, GAME.height / 1.5)

    canvasContext.font = '16px Arial'
    canvasContext.fillStyle = 'bisque'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('Press <SPACE> to start', GAME.width / 2, GAME.height / 1.3)
}

function updateEnemy() {
    ENEMY.x += ENEMY.xDirection

    let enemyTopCollision = BALL.x + BALL.radius >= ENEMY.x
        && BALL.x - BALL.radius <= ENEMY.x + ENEMY.width
        && BALL.y + BALL.radius >= ENEMY.y
        && BALL.y - BALL.radius <= ENEMY.y
    let enemyLeftCollision = BALL.y + BALL.radius >= ENEMY.y
        && BALL.y - BALL.radius <= ENEMY.y + ENEMY.height
        && BALL.x + BALL.radius >= ENEMY.x
        && BALL.x - BALL.radius <= ENEMY.x
    let enemyRightCollision = BALL.y + BALL.radius >= ENEMY.y
        && BALL.y - BALL.radius <= ENEMY.y + ENEMY.height
        && BALL.x + BALL.radius >= ENEMY.x + ENEMY.width
        && BALL.x - BALL.radius <= ENEMY.x + ENEMY.width
    let enemyBottomCollision = BALL.x + BALL.radius >= ENEMY.x
        && BALL.x - BALL.radius <= ENEMY.x + ENEMY.width
        && BALL.y + BALL.radius >= ENEMY.y + ENEMY.height
        && BALL.y - BALL.radius <= ENEMY.y + ENEMY.height

    if (enemyTopCollision || enemyLeftCollision || enemyRightCollision || enemyBottomCollision) {
        ANIMATION.explosion = true

        ANIMATION.x = BALL.x
        ANIMATION.y = BALL.y

        drawAnimation()
        requestAnimationFrame(drawAnimation)

        if (ANIMATION.count !== 0) {
            ANIMATION.count = 0;
        } 

        ENEMY.x = 500
        ENEMY.y = 10 + Math.random() * 260
        BALL.x = 20
        BALL.y = 290

        GAME.score += 1

        if (GAME.score % 3 === 0) {
            GAME.level += 1
            ENEMY.xDirection -= 0.25
        }

        BALL.xDirection = (TANK.gunAngle - 1.45) / 0.05 * 0.8
        BALL.yDirection = BALL.xDirection - 8
    }

    if (ENEMY.x - 20 <= 0) {
        ENEMY.x = 500
        ENEMY.y = 10 + Math.random() * 260
        BALL.x = 20
        BALL.y = 290

        GAME.life -= 1
    }

    if (GAME.life === 0) {
        isMoving = false
        BALL.x = 20
        BALL.y = 290
        ENEMY.xDirection = ENEMY.xDefaultDirection
        // console.log('Вы проиграли.')
        drawDefeatScreen()
    }

    if (GAME.level >= 10) {
        isMoving = false
        BALL.x = 20
        BALL.y = 290
        // console.log('Вы выиграли.')
        drawVictoryScreen()
    }
}

function updateBall() {
    BALL.x += BALL.xDirection
    BALL.y += BALL.yDirection

    if (BALL.x > GAME.width || BALL.x < 0 || BALL.y > GAME.height || BALL.y < 0) {
        BALL.x = 20
        BALL.y = 290

        BALL.xDirection = (TANK.gunAngle - 1.45) / 0.05 * 0.8
        BALL.yDirection = BALL.xDirection - 8
    }
}

function drawGameData() {
    canvasContext.font = '24px Arial'
    canvasContext.fillStyle = 'white'
    canvasContext.textAlign = 'start'
    canvasContext.fillText('Score: ' + GAME.score, 20, 32)

    canvasContext.font = '24px Arial'
    canvasContext.fillStyle = 'green'
    canvasContext.textAlign = 'center'
    canvasContext.fillText('Level: ' + GAME.level, GAME.width / 2, 32)

    canvasContext.font = '24px Arial'
    canvasContext.fillStyle = 'red'
    canvasContext.textAlign = 'end'
    canvasContext.fillText('Life: ' + GAME.life, GAME.width - 20, 32)
}

// Функция прослушиания событий
function initEventListeners() {
    window.addEventListener('keydown', onCanvasKeyDown)
}

// Обработчик нажатия клавиш
function onCanvasKeyDown(event) {
    if (event.key === 'ArrowUp') {
        if (TANK.gunAngle > 1.45) {
            TANK.gunAngle -= 0.05
        }
    }

    if (event.key === 'ArrowDown') {
        if (TANK.gunAngle < 1.95) {
            TANK.gunAngle += 0.05
        } 
    }

    if (event.code == 'Space') {
        isMoving = !isMoving
        updateBall()
        play()

        if (GAME.level >= 10 || GAME.life <= 0) {
            GAME.level = 1
            GAME.score = 0
            GAME.life = 3
            play()
        }
    }

    if (event.code == 'Escape') {
        isMoving = false
        BALL.x = 20
        BALL.y = 290
        GAME.level = 1
        GAME.score = 0
        GAME.life = 3
        TANK.gunAngle = 1.7
        ENEMY.xDirection = ENEMY.xDefaultDirection
        
        drawStartScreen()
        requestAnimationFrame(drawStartScreen)
    }
} 

initAnimation()
initBackground()
initEventListeners()
play()
