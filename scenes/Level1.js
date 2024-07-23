class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 33,
    });
  }

  create() {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "sky")
      .setScale(Math.max(this.scale.width / 800, this.scale.height / 600))
      .setScrollFactor(0);

    const platforms = this.physics.add.staticGroup();

    platforms.create(100, 968, "ground").setScale(8).refreshBody();
    platforms.create(1600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setScale(2);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, platforms);

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

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown) {
      velocityX = -160;
      this.lastDirection = "left";
    }
    if (this.cursors.right.isDown) {
      velocityX = 160;
      this.lastDirection = "right";
    }
    if (this.cursors.up.isDown) {
      velocityY = -160;
    }
    if (this.cursors.down.isDown) {
      velocityY = 160;
    }

    this.player.setVelocityX(velocityX);
    this.player.setVelocityY(velocityY);

    if (velocityX < 0) {
      this.player.anims.play("left", true);
    } else if (velocityX > 0) {
      this.player.anims.play("right", true);
    } else if (velocityY !== 0) {
      if (this.lastDirection === "left") {
        this.player.anims.play("left", true);
      } else {
        this.player.anims.play("right", true);
      }
    } else {
      this.player.anims.play("turn");
    }
  }
}

// export default Level1;

// Сделаем класс доступным в глобальной области видимости
window.Level1 = Level1;
