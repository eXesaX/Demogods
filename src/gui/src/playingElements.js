/**
  * @file Contains Playing element class and its children. Responsible for cards, players and monsters logics and render on the table.
  * @author Petrov Alexnader exesa@yandex.ru
  * @requires Phaser.js
  * @requires globals.js
  */



/**
 * @class 
 * @classdesc Playing element class. Ancestor of main playing elements on table, such as cards, player and monsters
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 */
function PlayingElement(id, imageUrl, x, y) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.sprite = game.add.image(x, y, this.imageUrl);
    if (game.cache.checkImageKey(imageUrl)) {
        this.fitToScreen();
    } else {
        dynamicImageLoad(this.id, this.imageUrl, this);
    }


    this.sprite.anchor = new Phaser.Point(0.5, 0.5);

    this.sprite.events.onDragStart.add(this.savePosition, this);
    this.sprite.events.onDragStop.add(this.onDragStop, this);
    this.sprite.events.onInputOver.add(this.onHover, this);
    this.sprite.events.onInputOut.add(this.onHoverOut, this);
    
    this._prevX = null;
    this._prevY = null;

    attackSignal.add(this.checkIntersections, this);
}
PlayingElement.prototype.loadSprite = function() {
    this.sprite.loadTexture(this.imageUrl);
};

/** @method PlayingElement#onDragStop 
  * @desc DragnDrop stop event handler
  */
PlayingElement.prototype.onDragStop = function() {

    attackSignal.dispatch(this);
    this.restorePosition();
};

/** @method PlayingElement#fitToScreen 
  * @desc Resizes sprite according to user's display size
  */
PlayingElement.prototype.fitToScreen = function() {
    var originalSpriteHeight = this.sprite.height;
    this.sprite.height = Math.floor(VIEWPORT_H / TABLE_ZONES);
    //console.log(this.sprite.height);
    this.sprite.width = Math.floor(this.sprite.width / (originalSpriteHeight / this.sprite.height));
    
};

/**
 * @method PlayingElement#onHover
 * @desc Item's hover event handler
 */
PlayingElement.prototype.onHover = function() {
    this.sprite.blendMode = PIXI.blendModes.ADD;
};
/**
 * @method PlayingElement#onHoverOut
 * @desc Item's hover out event handler
 */
PlayingElement.prototype.onHoverOut = function() {
    this.sprite.blendMode = PIXI.blendModes.NORMAL;
};

/** @method PlayingElement#destroy 
  * @desc destroys object
  */
PlayingElement.prototype.destroy = function() {
    attackSignal.remove(this.checkIntersections, this);
    this.sprite.destroy();
};

/** @method PlayingElement#attack
  * @desc Plays attack animation
  * @arg {PlayingElement} target Object being attacked
  * @returns {Phaser.Tween} Tween being played
  */
PlayingElement.prototype.attack = function(target) {
    var energyBall = game.add.image(this.sprite.x, this.sprite.y, 'energy_ball');
    energyBall.anchor = new Phaser.Point(0.5, 0.5);
    var tween = game.add.tween(energyBall);
    function d() {
        energyBall.destroy();
    }
    tween.to( { x: target.sprite.x, y: target.sprite.y }, 400);
    
    tween.onComplete.add(d);
    return tween.start();
};

/** @method PlayingElement#attack2
 * @desc Plays another attack animation
 * @arg {PlayingElement} target Object being attacked
 * @returns {Phaser.Tween} Tween being played
 */
PlayingElement.prototype.attack2 = function(target) {
    var lightning = game.add.rope(0, 0, 'lightning', null, [new Phaser.Point(this.sprite.x, this.sprite.y), new Phaser.Point(target.sprite.x, target.sprite.y)]);
    lightning.animations.add("ligntning", null, 60, true);
    lightning.animations.play("lightning");
    lightning.play("lightning");

    var tween = game.add.tween(lightning);

    var smoke = game.add.emitter(target.sprite.x, target.sprite.y, 50);
    smoke.gravity = -400;
    smoke.setAlpha(1, 0, 1600);
    smoke.makeParticles("smoke", null, 50);

    var sparks = game.add.emitter(target.sprite.x, target.sprite.y, 10);
    sparks.gravity = 100;
    sparks.setAlpha(1, 0, 2000);
    sparks.setScale(0.1, 0.3, 0.1, 0.3);
    sparks.makeParticles("spark", null, 10);

    function d() {
        lightning.destroy();
    }
    function s() {
        lightning.bringToTop();
        smoke.start(true, 800, null, 50);
        sparks.start(true, 1000, null, 10);
    }
    tween.to( {x: 0, y: 0 }, 200);
    tween.onStart.add(s);
    tween.onComplete.add(d);
    return tween.start();
};

/** @method PlayingElement#getBounds
  * @desc Returns rectangle, occupied by element
  * @returns {Phaser.Rectangle}
  */
PlayingElement.prototype.getBounds = function() {
    return this.sprite.getBounds();
};

/**
  * @method PlayingElement#savePosition
  * @desc Saves current element posistion
  */
PlayingElement.prototype.savePosition = function() {
    this._prevX = this.sprite.x;
    this._prevY = this.sprite.y;
};

/**
  * @method PlayingElement#restorePosition
  * @desc restores position, previously saved by {@link PlayingElement#savePosition}
  */
PlayingElement.prototype.restorePosition = function() {
    if ((this._prevX != null) && (this._prevY != null)) {
        this.sprite.x = this._prevX;
        this.sprite.y = this._prevY;
    }
};

/**
  * @method PlayingElement#checkIntersections
  * @desc checks if current element intersects any other in game. Returns true and calls PlayingElement#onIntersection if so
  * @returns {Boolean}
  */
PlayingElement.prototype.checkIntersections = function(attacker) {
    if (Phaser.Rectangle.intersects(new Phaser.Rectangle(attacker.sprite.x, attacker.sprite.y, 2, 2),
                                    this.sprite.getBounds()) && attacker != this) {
        attacker.onIntersection(this);
    }
};

/**
  * @method PlayingElement#onIntersection 
  * @desc Intersection event handler
  * @arg {PlayingElement} target Object being attacked
  */
PlayingElement.prototype.onIntersection = function(target) {
    this.restorePosition();
    this.attack2(target);
};

/**
 * @class 
 * @classdesc Card class. Represents player's cards on playing table.
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 * @extends PlayingElement
 */ 
function Card(id, imageUrl, x, y) {
    PlayingElement.apply(this, arguments);
    this.sprite.inputEnabled = true;
    this.sprite.input.enableDrag();
}

Card.prototype = Object.create(PlayingElement.prototype);
Card.prototype.constructor = PlayingElement;

Card.prototype.destroy = function() {
    attackSignal.remove(this.checkIntersections, this);
    this.sprite.destroy();
};


 /**
 * @class 
 * @classdesc Monster class. Represents monsters spawned on playing table.
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 * @extends PlayingElement
 */
function Monster(id, imageUrl, x, y) {
    PlayingElement.apply(this, arguments);
    this.sprite.inputEnabled = true;
    this.sprite.input.enableDrag();

    
    var healthStyle = { font: String(Math.floor(this.sprite.height / 5)) + "px Arial", fill: "#ffffff"};
    this.health = game.add.text(this.sprite.x, this.sprite.y, '0', healthStyle);
}

Monster.prototype = Object.create(PlayingElement.prototype);
Monster.prototype.constructor = PlayingElement;

/**
  * @method Monster#setHealth
  * @desc Sets health level of this Monster.
  * @arg {number} Health level
  */
Monster.prototype.setHealth = function(health) {
    this.health.text = health;
};

Monster.prototype.destroy = function() {
    attackSignal.remove(this.checkIntersections, this);
    this.sprite.destroy();
    this.health.text= '';
    this.health.destroy();
};

/**
  * @method Mosnter#update
  * @desc Redraws monster on call. Must be called on global update.
  */
Monster.prototype.update = function() {
    this.health.x = this.sprite.x;
    this.health.y = this.sprite.y;
};

/**
 * @class 
 * @classdesc Player class. Represents players icon and health level
 * @arg {string} id Unique element's id
 * @arg {string} imageUrl Link to a image which will be shown ingame
 * @arg {number} x Coordinate on x-axis
 * @arg {number} y Coordinate on y-axis
 * @extends PlayingElement
 */
function Player(id, imageUrl, x, y) {
    PlayingElement.apply(this, arguments);
    this.sprite.inputEnabled = true;
    
    var healthStyle = { font: String(Math.floor(this.sprite.height / 5)) + "px Arial", fill: "#ffffff"};
    this.health = game.add.text(this.sprite.x, this.sprite.y, '0', healthStyle);
}

Player.prototype = Object.create(PlayingElement.prototype);
Player.prototype.constructor = PlayingElement;

/**
  * @method Player#setHealth
  * @desc Sets health level of this Monster.
  * @arg {number} Health level
  */
Player.prototype.setHealth = function(health) {
    this.health.text = health;
};

Player.prototype.destroy = function() {
    this.sprite.destroy();
    this.health.text = '';
    this.health.destroy();
};




