// grab a reference of our "canvas" using its id
const canvas = document.getElementById('canvas');

// get a "context". Without "context", we can't draw on canvas
const ctx = canvas.getContext('2d');

// some sounds
const hitSound = new Audio("../sounds/hitSound.wav");
const scoreSound = new Audio('../sounds/scoreSound.wav');
const wallHitSound = new Audio('../sounds/wallHitSound.wav');

// some extra variables
const netWidth = 4;
const netheight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;

let isGameOver = false;
let winner = 0;
let scored = 3;

// objects
// net
const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netheight,
    color: "#005bbb"
};

// user paddle
const user = {
    x:10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#005bbb",
    score: 0
};

// ai paddle
const ai = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#005bbb",
    score: 0
};

// ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: "#000000"
};

// function to draw net
function drawNet(){
    // set the color of the net
    ctx.fillStyle = net.color;

    // syntax --> fillRect(x,y,width,height)
    ctx.fillRect(net.x,net.y,net.width,net.height);
}

// function to draw score
function drawScore(x, y, score){
    ctx.fillStyle = "#005bbb";
    ctx.font = "35px Hey Gorgeous";
    ctx.fillText(score, x, y);
}

// function to draw game over with player win
function drawPlayerGameOver(x,y){
    ctx.fillStyle = "#005bbb";
    ctx.font = "35px Hey Gorgeous";
    ctx.fillText("Game Over! Player Wins!", x, y);
}

// function to draw game over with ai win
function drawAIGameOver(x,y){
    ctx.fillStyle = "#005bbb";
    ctx.font = "35px Hey Gorgeous";
    ctx.fillText("Game Over! AI Wins!", x, y);
}

// function to draw paddle
function drawPaddle(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// function to draw ball
function drawBall(x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// function to draw Player cheer
function drawPlayerCheer(x,y){
    ctx.fillStyle = "#005bbb";
    ctx.font = "20px Hey Gorgeous";
    ctx.fillText("Player Scored!", x, y);
}

// function to draw AI cheer
function drawAICheer(x,y){
    ctx.fillStyle = "#005bbb";
    ctx.font = "20px Hey Gorgeous";
    ctx.fillText("AI Scored!", x, y);
}

// moving paddles
// add an eventlistener to browser window
window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", KeyUpHandler);

// gets activated when we press down a key
function keyDownHandler(event){
    // get the keyCode
    switch (event.keyCode){
        // 'up arrow' key
        case 38:
            // set upArrowPressed = true
            upArrowPressed = true;
            break;
        // 'down arrow' key
        case 40:
            downArrowPressed = true;
            break; 
    }
}

// gets activated when we release the key
function KeyUpHandler(event){
    switch (event.keyCode){
        // 'up arrow' key
        case 38:
            upArrowPressed = false;
            break;
        // 'down arrow' key
        case 40:
            downArrowPressed = false;
            break;
    }
}

// reset the ball
function reset(){
    // reset balls value to older values
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;

    // changes the direction of the ball
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}

// collision Detect function
function collisionDetect(player, ball){
    // returns true or false
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}

// update function, to update things position
function update(){

    if(!isGameOver){

    // move the paddle
    if (upArrowPressed && user.y > 0){
        user.y -= 8;
    }
    else if (downArrowPressed && (user.y < canvas.height - user.height)){
        user.y += 8;
    }

    // check if ball hits top or bottom wall
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0){
        // play wallHitSound
        wallHitSound.play();
        ball.velocityY = -ball.velocityY;
    }

    // if ball hit on right wall
    if (ball.x + ball.radius >= canvas.width){
        // play scoreScound
        scoreSound.play();
        // then user scored 1 point
        user.score += 1;
        scored = 0;
        if (user.score == 20){
            isGameOver = true;
            winner = 0;
        }
        else{
            reset();
        }
    }

    // if ball hit on left wall
    if(ball.x - ball.radius <= 0){
        // play scoreSound
        scoreSound.play();
        // then ai scored 1 point
        ai.score += 1;
        scored  = 1;
        if (ai.score == 20){
            isGameOver = true;
            winner = 1;
        }
        else{
            reset();
        }
    }

    // move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // ai paddle movement
    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;

    // collision detection on paddles
    let player = (ball.x < canvas.width / 2) ? user:ai;
    if (collisionDetect(player, ball)){
        // play hitsound
        hitSound.play();
        // default angle is 0deg in Radian
        let angle = 0;

        // if ball hit the top of paddle
        if (ball.y < (player.y + player.height / 2)){
            // then -1 * Math.PI / 4 = -45deg
            angle = -1 *Math.PI / 4;
        }
        else if (ball.y > (player.y + player.height / 2)){
            // if it hit the bottom of paddle
            // then angle will be Math.PI / 4 = 45 deg
            angle = Math.PI / 4;
        }

        // change velocity of ball according to on which paddle the ball hit
        ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        // increase ball speed
        ball.speed += 0.2;
    }
    }
}

// render function draws everything onto canvas
function render(){
    if (!isGameOver){
    // set a style
    ctx.fillStyle = "#ffd500"; 
    // draws the black board
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // draw net
    drawNet();
    // draw user score
    drawScore(canvas.width / 4, canvas.height / 6, user.score);
    // draw ai score
    drawScore(3 * canvas.width / 4, canvas.height / 6, ai.score);
    // draw user paddle
    drawPaddle(user.x, user.y, user.width, user.height, user.color);
    // draw ai paddle
    drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color);
    // draw ball
    drawBall(ball.x, ball.y, ball.radius, ball.color);
    // draw cheer
    if (scored == 0){drawPlayerCheer(canvas.width / 4.5, canvas.height / 3);}
    else if (scored == 1){drawAICheer(3 * canvas.width / 4.5, canvas.height / 3);}
    }
    else {
        // set a style
        ctx.fillStyle = "#ffd500"; 
        // draws the black board
        ctx.fillRect(0,0,canvas.width,canvas.height);
        // winner
        if (winner == 0){
            drawPlayerGameOver(canvas.width/4,canvas.height/2);
        }
        else {drawAIGameOver(canvas.width/4,canvas.height/2);}
    }
}

// game loop
function gameLoop(){
    // update() function here
    update();
    // render() function here
    render();
}

// calls gameLoop() function 60 times per second
setInterval(gameLoop, 1000 / 60);

