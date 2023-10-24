class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/time sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship_red', './assets/spaceship_red.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrane: 0, endFrame: 9});

        // load music
        this.load.audio('bgm', './assets/8-bit-space.mp3');
    }

    create() {
        // music
        this.bgm = this.sound.add('bgm', {
            loop: true,
        });

        let musicConfig = {
            volume: 1,
            rate: 1,
            loop: true,
            delay: 0,
        }

        this.bgm.play();

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(2);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(2);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0).setDepth(2);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(2);
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderUISize*4, 'spaceship', 0, 10).setOrigin(0, 0);

        this.redship = new Spaceship(this, (game.config.width)*(0.75), (borderUISize*3 + borderUISize*6 + borderPadding*2)*(0.75), 'spaceship_red', 0, 50).setOrigin(0, 0);
        this.redship.setScale(.75);
        this.redship.setDepth(1);
        this.redship.setName('redship');

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}), 
            frameRate: 30,
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // highscore
        this.highscoreText = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2 + (borderUISize + borderPadding*2), "Highscore: " + highscore)

        // display time
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeDisplay = this.add.text(game.config.width - (timeConfig.fixedWidth + borderPadding + borderUISize), borderUISize + borderPadding*2, game.settings.gameTimer, timeConfig);

        // display fire
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.fireText = this.add.text(game.config.width/2, borderUISize + borderPadding*2, 'FIRE', fireConfig).setOrigin(0.5, 0);

        // GAME OVER flag
        this.gameOver = false;

        // 60 second play clock
        this.timer = game.settings.gameTimer;
        this.elapsed = 0;
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(this.timer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5).setDepth(2);
            this.gameOver = true;
            this.bgm.stop();
            if (this.p1Score > highscore) {
                highscore = this.p1Score;
                this.highscoreText.setText("Highscore: " + highscore);
                console.log("new highscore: " + highscore);
            }
        }, null, this);

        this.speedUp = false;
    }

    update() {
        // check if 30 seconds have passed
        if (this.speedUp == false && (this.timer - this.elapsed) <= 30000) {
            console.log("speeding up");
            this.ship01.speedUp(1);
            this.ship02.speedUp(2);
            this.ship03.speedUp(3);
            this.redship.speedUp(3);
            this.speedUp = true;
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        
        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {
            this.p1Rocket.update(); // update rocket sprite
            this.ship01.update();   // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.redship.update();
        }

        // display 'FIRE' if rocket is firing
        if (this.p1Rocket.isFiring) {
            this.fireText.y = borderUISize + borderPadding*2;
        }

        else {
            this.fireText.y = -200;
        }
        

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }

        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }

        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        if (this.checkCollision(this.p1Rocket, this.redship)) {
            this.p1Rocket.reset();
            this.shipExplode(this.redship);
        }

        // timer
        this.elapsed = this.clock.getElapsed();
        this.timeDisplay.text = Math.floor((this.timer - this.elapsed)/1000);
    }


    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true;
        }

        else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporary hide ship
        ship.alpha = 0;

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    //callback after anim completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });

        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // play 
        let rand = Phaser.Math.Between(0, 4);
        if (rand == 1) this.sound.play('explosion01');
        else if (rand == 2) this.sound.play('explosion02');
        else if (rand == 3) this.sound.play('explosion03');
        else if (rand == 4) this.sound.play('explosion04');
        else this.sound.play('sfx_explosion');
        

        this.timer += 5000;
        console.log("timer +5: " + this.timer/1000);
        this.timer -= this.elapsed;
        console.log("elapsed: " + this.elapsed/1000)
        this.updateTimer();
        console.log("updated timer: " + this.timer/1000)
    }

    updateTimer() {
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        scoreConfig.fixedWidth = 0;
        // reset timer if ship is hit
        this.clock.remove();
        this.clock = this.time.delayedCall((this.timer), () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5).setDepth(2);
            this.gameOver = true;
            this.bgm.stop();
            if (this.p1Score > highscore) {
                highscore = this.p1Score;
                this.highscoreText.setText("Highscore: " + highscore);
            }
        }, null, this);
    }
}