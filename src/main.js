/* Edwin Fong
// Rocket Ratrol 
// Estimated Modding Time: 6 hours
// 
// Mods:
// Track a high score (1)
// Implement the 'FIRE' UI text (1)
// Add looping background music to play scene (1)
// Implement speed increase that happens after 30 seconds (1)
// Create 4 new explosion effects that randomize (3)
// Display time remaining (3)
// Create new enemy spaceship (5)
// New timing/scoring mechanism that adds time to clock for successful hits (5)
//
// Citations:
// 8-bit-space by Purrsahfef: https://pixabay.com/music/video-games-8-bit-space-123218/ 
// explosion01 by Pixaby: https://pixabay.com/sound-effects/hq-explosion-6288/ 
// explosion02 by Pixaby: https://pixabay.com/sound-effects/explosion-6801/
// explosion03 by Pixaby: https://pixabay.com/sound-effects/bigboom-42826/ 
// explosion04 by Pixaby: https://pixabay.com/sound-effects/explosion-6055/ 
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let highscore = 0;