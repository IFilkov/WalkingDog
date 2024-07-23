const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Изменяем гравитацию, чтобы персонаж мог свободно двигаться
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
  // Загрузка ресурсов
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  // Создание сцены
  this.add
    .image(this.scale.width / 2, this.scale.height / 2, "sky")
    .setScale(Math.max(this.scale.width / 800, this.scale.height / 600))
    .setScrollFactor(0);

  // Платформы
  const platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, "ground").setScale(2).refreshBody();
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  // Игрок
  player = this.physics.add.sprite(100, 450, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);

  // Анимации
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

  // Клавиатура
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // Логика управления
  let velocityX = 0;
  let velocityY = 0;

  if (cursors.left.isDown) {
    velocityX = -160;
  }
  if (cursors.right.isDown) {
    velocityX = 160;
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
    player.anims.play("turn");
  } else {
    player.anims.play("turn");
  }
}
