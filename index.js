let backgroundMusic = null;
let dropSound = null;
let started = false;

let bucket = null;
let bucketX = 0;
let bucketY = 0;

let playerScore = 0;

let raindropImage = null;
const maxRaindrops = 10;
const raindrops = [];

function setup() {
  createCanvas(600, 600);

  backgroundMusic = loadMusic('music.mp3', true);
  dropSound = loadMusic('drop.mp3');

  bucket = loadImage('bucket.png');
  bucketX = width / 2 - 50;
  bucketY = height - 100;

  raindropImage = loadImage('drop.png');
  
  textSize(32);
  textAlign(CENTER);

  setInterval(() => {
    if (started && raindrops.length < maxRaindrops) {
      const x = random(0, width - raindropImage.width);
      const y = 0;
      raindrops.push({ x, y: y - raindropImage.height });
    }
  }, 1000);
}

function draw() {
  background(SKYBLUE);

  image(bucket, bucketX, bucketY);

  if (!started) {
    fill(WHITE);
    text('Click to Start', width / 2, height / 2);
    return;
  }
  
  for (let i = 0; i < raindrops.length; i++) {
    image(raindropImage, raindrops[i].x, raindrops[i].y);
    raindrops[i].y += 5;

    if (raindrops[i].y > height) {
      raindrops.splice(i, 1);
      playerScore--;
    }

    if (
      raindrops[i].y + raindropImage.height >= bucketY + 30 &&
      raindrops[i].x + raindropImage.width >= bucketX &&
      raindrops[i].x <= bucketX + bucket.width
    ) {
      dropSound.play();
      raindrops.splice(i, 1);
      playerScore++;
    }
  }

  fill(WHITE);
  text(`Score: ${playerScore}`, width / 2, 50);
}

function mousePressed() {
  started = true;

  if (backgroundMusic.paused) {
    playMusic(backgroundMusic);
  }
}

function mouseMoved() {
  if (mouseIsPressed) {
    bucketX = min(mouseX, width - bucket.width);
  }
}
