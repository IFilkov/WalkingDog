const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

let player;
let cursors;
let lastDirection = "right"; // Хранит последнее горизонтальное направление

function create() {
  this.add
    .image(this.scale.width / 2, this.scale.height / 2, "sky")
    .setScale(Math.max(this.scale.width / 800, this.scale.height / 600))
    .setScrollFactor(0);

  const platforms = this.physics.add.staticGroup();

  platforms.create(100, 968, "ground").setScale(8).refreshBody();
  platforms.create(1600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  player = this.physics.add.sprite(100, 450, "dude");
  player.setScale(2);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  let velocityX = 0;
  let velocityY = 0;

  if (cursors.left.isDown) {
    velocityX = -160;
    lastDirection = "left";
  }
  if (cursors.right.isDown) {
    velocityX = 160;
    lastDirection = "right";
  }
  if (cursors.up.isDown) {
    velocityY = -160;
  }
  if (cursors.down.isDown) {
    velocityY = 160;
  }

  player.setVelocityX(velocityX);
  player.setVelocityY(velocityY);

  if (velocityX < 0) {
    player.anims.play("left", true);
  } else if (velocityX > 0) {
    player.anims.play("right", true);
  } else if (velocityY !== 0) {
    if (lastDirection === "left") {
      player.anims.play("left", true);
    } else {
      player.anims.play("right", true);
    }
  } else {
    player.anims.play("turn");
  }
}
