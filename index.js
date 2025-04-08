// Variable für die Hintergrundmusik
let backgroundMusic = null;
// Variable für das Geräusch, das beim Auffangen eines Tropfens abgespielt wird
let dropSound = null;
// Gibt an, ob das Spiel gestartet wurde
let started = false;

// Das Eimer-Bild
let bucket = null;
// X-Position des Eimers
let bucketX = 0;
// Y-Position des Eimers
let bucketY = 0;

// Die Punktzahl des Spielers
let playerScore = 0;

// Bild für die Regentropfen
let raindropImage = null;
// Die Breite des Regentropfen Bilds
const raindropWidth = 100;
// Die Höhe des Regentropfen Bilds
const raindropHeight = 100;
// Maximale Anzahl der Regentropfen
const maxRaindrops = 10;
// Array, das alle aktuellen Regentropfen speichert
const raindrops = [];

function setup() {
  createCanvas(600, 600);

  // Lädt die Musikdateien
  // Hintergrundmusik wird geladen
  backgroundMusic = loadMusic('music.mp3', true);
  // Geräusch für den Tropfen wird geladen
  dropSound = loadMusic('drop.mp3');

  // Lädt das Bild des Eimers
  bucket = loadImage('bucket.png');
  // Setzt die X-Position des Eimers auf die Mitte der Leinwand
  bucketX = width / 2 - raindropWidth / 2;
  // Setzt die Y-Position des Eimers auf 100 Pixel vom unteren Rand der Leinwand
  bucketY = height - raindropHeight;

  // Lädt das Bild für den Regentropfen
  raindropImage = loadImage('drop.png');
  
  // Setzt die Textgröße auf 32
  textSize(32);
  // Text wird horizontal in der Mitte ausgerichtet
  textAlign(CENTER);

  // Alle 1000 Millisekunden (1 Sekunde) wird ein neuer Regentropfen erzeugt.
  // Dies passiert nur, wenn das Spiel läuft und noch nicht die maximale Anzahl an Tropfen erreicht ist
  setInterval(() => {
    if (started && raindrops.length < maxRaindrops) {
      // Zufällige X-Position für den Tropfen
      const x = random(0, width - raindropWidth);
      // Tropfen startet immer oben
      const y = 0;
      raindrops.push({
        x: x, // Setzt die X-Position des Tropfens
        y: y - raindropHeight // Setzt die Y-Position des Tropfens (einen Tropfen hoch über der Leinwand)
      });
    }
  }, 1000); // Wiederholt sich jede Sekunde
}

function draw() {
  // Setzt den Hintergrund auf Himmelblau
  background(SKYBLUE);

  // Zeigt die aktuelle Punktzahl des Spielers oben auf dem Bildschirm an
  fill(WHITE);
  // Zeigt den Text "Score: [Punktzahl]" in der Mitte des oberen Randes
  text(`Score: ${playerScore}`, width / 2, 50);

  // Zeigt das Bild des Eimers an der aktuellen Position
  image(bucket, bucketX, bucketY);

  // Wenn das Spiel noch nicht gestartet wurde
  if (!started) {
    // Setzt die Textfarbe auf weiß
    fill(WHITE);
    // Zeigt den Text "Click to Start" in der Mitte der Leinwand an
    text('Click to Start', width / 2, height / 2);
    // Stoppt die Ausführung der Funktion, um nur den Text zu zeigen
    return;
  }
  
  // Zeichnet alle Regentropfen und bewegt sie
  for (let i = 0; i < raindrops.length; i++) {
    // Zeichnet den Tropfen an seiner aktuellen Position
    image(raindropImage, raindrops[i].x, raindrops[i].y);
    // Bewegt den Tropfen nach unten (erhöht die Y-Position)
    raindrops[i].y += 5;

    // Wenn der Tropfen den unteren Rand des Bildschirms erreicht, wird er entfernt und der Spieler verliert einen Punkt
    if (raindrops[i].y > height) {
      // Entfernt den Tropfen aus dem Array
      raindrops.splice(i, 1);
      // Spieler verliert einen Punkt
      playerScore--;
    }

    // Wenn der Tropfen den Eimer berührt, wird der Tropfen entfernt und der Spieler bekommt einen Punkt
    if (rectCollision(raindrops[i].x, raindrops[i].y, raindropWidth, raindropHeight - 30, bucketX, bucketY, bucket.width, bucket.height)) {
      // Spielt das Geräusch ab, wenn der Tropfen den Eimer trifft
      playMusic(dropSound);
      // Entfernt den Tropfen aus dem Array
      raindrops.splice(i, 1);
      // Spieler bekommt einen Punkt
      playerScore++;
    }
  }
}

// Wenn die Maus geklickt wird, startet das Spiel und die Hintergrundmusik wird abgespielt
function mousePressed() {
  // Setzt den Spielstatus auf "gestartet"
  started = true;

  // Wenn die Musik nicht läuft, wird sie abgespielt
  if (backgroundMusic.paused) {
    playMusic(backgroundMusic);
  }
}

// Wenn die Maus bewegt wird und gedrückt gehalten wird, bewegt sich der Eimer mit der Maus
function mouseMoved() {
  if (mouseIsPressed) {
    // Der Eimer folgt der Maus, bleibt aber innerhalb des Bildschirmrandes
    bucketX = min(mouseX, width - bucket.width);
  }
}
