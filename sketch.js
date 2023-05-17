/************************************************************************************************
Uncomment "Debug" comments, to enable Debug functions

Comands in Debug mode:
-> Type "x" to enable/disable debug mode.
-> Type "p" When debug mode is on to enable/disable boll controls.
-> Type "o" When debug mode is on to set boll speed to 5.
-> Type "l" when debug mode is on to play/pause the game.

Boll controls (when debug mode is on):
-> Type "w" to move boll 'up'.
-> Type "s" to move boll 'down'.
-> Type "a" to move boll 'left'.
-> Type "d" to move boll 'right'.
************************************************************************************************/

//Boll parameters
let xBoll = 300;
let yBoll = 200;
let diameter = 28;
let bollRadius = diameter / 2;
//####Debug####
//let manualControl = false;

//Boll speed
let xBollSpeed = 5;
let yBollSpeed = 5;

//Racket size
let racketWidth = 10;
let racketHeight = 90;
let hitRacket = false;

//PlayerRacket parameters
let xPlayerRacket = 5;
let yPlayerRacket = 155;
let hitRate = 0;

//GameRacket parameters
let xGameRacket = 585;
let yGameRacket = 150;
let ySpeedRacket = 1;
let missChance = 0;

//GameScore
let playerPoints = 0;
let gamePoints = 0;

//GameSounds
let colisionSound;
let pointSound;
let ambientSound;

//GameParameters
//####Debug####
//let gameOn = true;
//let debug = false;

function preload(){
  ambientSound = loadSound("ambientSound.wav");
  pointSound = loadSound("ponto.mp3");
  colisionSound = loadSound("raquetada.mp3");
}

function setup() {
  createCanvas(600, 400);
  ambientSound.loop();
}

function draw() {
  background(0);
  showBoll();
  showRacket(xPlayerRacket, yPlayerRacket, racketWidth, racketHeight);
  showRacket(xGameRacket, yGameRacket, racketWidth, racketHeight);
  showScore();
//####Debug####
//if(gameOn){
  bollMotion();
  colisionRacketCheck();
  colisionWallCheck();
  movePlayerRacket();
  moveGameRacket();
  checkPoint();
  noStucking();
//####Debug####
//}
//debugCheck();
}

function showBoll(){
  circle(xBoll,yBoll,diameter);  
}

function showRacket(x,y,width,height){  
  rect(x, y, width, height);
}


function bollMotion(){
  xBoll += xBollSpeed;
  yBoll -= yBollSpeed;
}

function colisionWallCheck(){
  if(xBoll > width - bollRadius || xBoll - bollRadius < 0){
    xBollSpeed *= -1;
  }
  if(yBoll > height - bollRadius || yBoll - bollRadius < 0){
     yBollSpeed *= -1;
  }
}


function colisionRacketCheck(){  
  if(colisionCheck(xPlayerRacket, yPlayerRacket, racketWidth, racketHeight, xBoll, yBoll, bollRadius)){    
    colisionSound.play();
    xBollSpeed *= -1;
    hitRate = (yPlayerRacket + (racketHeight/2)) - (yBoll);    
    if(hitRate < 0){
      hitRate *= -1;
    }
    hitRate = ((racketHeight/2) + (bollRadius/2)) - hitRate;
  }  
  if(colisionCheck(xGameRacket, yGameRacket, racketWidth, racketHeight, xBoll, yBoll, bollRadius)){
    colisionSound.play();
    xBollSpeed *= -1;
  }
}

function colisionCheck(x,y,width,height, xB, yB, bR){
  return collideRectCircle(x, y, width, height, xB, yB, bR);
}

function moveGameRacket(){
  ySpeedRacket = ((yBoll + (yBoll - (height/2))*(racketHeight/height)) - (yGameRacket + ((racketHeight) - (height/2)*((racketHeight)/height))));
  calcErrorChance();
  yGameRacket += ySpeedRacket + missChance;
  if(yGameRacket > height - (racketHeight/2)){
    yGameRacket = height - racketHeight/2;
  }
  if(yGameRacket < (racketHeight/2) * -1){
    yGameRacket = (racketHeight/2) * -1;
  }
}


function movePlayerRacket(){
  if(keyIsDown(UP_ARROW)){
    if(yPlayerRacket > - racketHeight / 2){
      yPlayerRacket -= 10;
    }
  }
  if(keyIsDown(DOWN_ARROW)){
    if(yPlayerRacket < 400 - racketHeight / 2){
      yPlayerRacket += 10;
    }
  }
}

function showScore(){
  stroke(255);
  textAlign(CENTER);
  textSize(16);
  fill(color(255,140,0));
  rect(150,10,40,20);
  fill(color(255,140,0));
  rect(450,10,40,20);
  fill(255);
  text(playerPoints, 170, 26);
  fill(255);
  text(gamePoints, 470, 26);
}

function checkPoint(){
  if(xBoll > 600 - bollRadius){
    playerPoints++;
    pointSound.play();
  }
  if(xBoll < bollRadius){
    gamePoints++;
    pointSound.play();
  }
}

function noStucking(){
  if(xBoll <= bollRadius){
    xBoll = xPlayerRacket + racketWidth + diameter;
  }else if(xBoll >= 600 - bollRadius){
    xBoll = xGameRacket - diameter;
  }
}

function calcErrorChance(){      
  if(gamePoints >= playerPoints){
    if(missChance > 0){
      missChance += 0.05 * (gamePoints - playerPoints);
      missChance += hitRate;
      hitRate = 0;
    }else{
      missChance -= 0.05 * (gamePoints - playerPoints);
      missChance -= hitRate;
      hitRate = 0;
    }
  }else{
    if(missChance > 0){
      missChance -= 0.05 * (playerPoints - gamePoints);
      missChance += hitRate;
      hitRate = 0;
    }else{
      missChance += 0.05 * (playerPoints - gamePoints);
      missChance -= hitRate;
      hitRate = 0;
    }
  }  
  if(missChance > 152){
     missChance = 152;    
  }
  if(missChance < -152){
     missChance = -152;
  }
}

//####Debug####
/*function keyPressed(){
  if(keyCode === 88){
    debug = !debug;
    }else if(debug){
      if(keyCode === 80){
             if(manualControl){
              manualControl = false;
              xBollSpeed = 5;
              yBollSpeed = 5;
              }else{
                manualControl = true;
                xBollSpeed = 0;
                yBollSpeed = 0;
            }
      }
    }
  
}*/

/* // <Debug> function debugCheck(){
  
  if(debug){
  if(keyIsDown(79)){
       xBollSpeed = 5;
      yBollSpeed = 5;
       }
  if(keyIsDown(76)){
    if(gameOn){
    gameOn = false;
    ambientSound.stop();
    }else{
      gameOn = true;
      ambientSound.loop();
    }
       }
      text("Boll X: " + xBoll + " Y: " + yBoll ,300,20)
    bollControl();
  }
}*/

/* //<Debug>function bollControl(){
  
  if(manualControl){
    //w
    if(keyIsDown(87)){
       yBoll--;
       }
    //s
    if(keyIsDown(83)){
       yBoll++;
       }
    //
    if(keyIsDown(65)){
       xBoll--;
       }
    //d
    if(keyIsDown(68)){
       xBoll++;
       }
  }
}*/