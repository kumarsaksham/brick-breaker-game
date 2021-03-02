
var canvas = document.querySelector("#myCanvas");
var ctx = canvas.getContext("2d");

// Score
var score = 0;

// lives
var lives = 3;

// Ball parameters
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;


// Paddle parameters
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var leftPressed = false;
var rightPressed = false;

// Brick Parameters
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status:1 };
    }
}

/*----------------EVENT LISTENER and EVENT HANDLER-----------------*/
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove",mouseMoveHandler,false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX >0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
        if(paddleX < 0){
            paddleX = 0;
        }
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
}
/*-------------------------------------------------------------------*/

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status==1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!\n" + "Score: " + score);
                        document.location.reload(); //reloads the page & starts the game again once the alert button is clicked.
                        // Changed rendering from setInterval to 
                        // clearInterval(interval); // Needed for Chrome to end game    
                    }
                }
            }
        }
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px, Arial";
    // ctx.fillStyle = "#0095DD";
    ctx.fillStyle = "#F59E0B";
    
    ctx.fillText("Score : " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    // ctx.fillStyle = "#0095DD";
    ctx.fillStyle = "#F59E0B";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing the canvas
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    x += dx;
    y += dy;

    // Bouncing the ball from LEFT and RIGHT wall
    if(x + dx < ballRadius || x + dx > canvas.width-ballRadius) {
        dx = -dx;
    }
    // Bouncing the ball from TOP wall
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        if(x >= paddleX && x <= paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER\n" + "Score: " + score );
                document.location.reload();
                // clearInterval(interval); // Needed for Chrome to end game
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    //Moving paddle to LEFT
    if(leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    //Moving paddle to RIGHT
    else if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }            

    requestAnimationFrame(draw);
}

// var interval = setInterval(draw, 10);
draw();

