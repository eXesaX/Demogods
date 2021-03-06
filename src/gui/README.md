# GUI client module for DEMOGODS  
  
## Usage:  
* make sure you have imported all dependencies in your html file (see **main.html** for example);  
* create instance of GUI class via `new GUI();`
* you will need a webserver to run;
* Note: each API method belongs to it's own game state, and doesn't work if other state is active (nothing will happen if you do so)

## API:  
### mainMenu state:
* `showMainMenu()` - shows main menu  
* `play()` - starts playing session. Currently called from main menu by big fancy "GO" button; 

### play state:
* `setPlayer1Health(health)` - obviously, sets player 1 health level (seen in top-left corner). Parameter is number;  
* `setPlayer2Health(health)` - same for player 2;  
* `addPlayer1Card(id, imageUrl)` - adds a card to first players' deck. **Id** must be unique string(still no checking implemented though), **imageUrl** is used for dynamic image loads (not implemented too, so it doesn't matter right now); sprite defined by id, which should be the same as image id preloaded during preload state; returns Card object; 
* `addPlayer2Card(id, imageUrl)` - same for player 2;  
* `addMonster(id, imageUrl, health)` - like player's deck, adds item to playing table (center of the screen). **Health** is a number.  Returns Monster object;
* `addOpponentsMonster(id, imageUrl, health)` - same for opponents monster
* `deletePlayer1Card(id)` - deletes card from first players' deck, specified by **id**;  returns `true` if successful;
* `deletePlayer2Card(id)` - same for the second player;  
* `deleteMonster(id)` - same for playing table;  
* `attack(attacker, target)` - Manually trigger attack action. **attacker** and **target** are unique id's of items.
* `moveMonster(id, position)` - Move monster to a new position an a table. **id** is unique id, **position** is new position of Monster.
* `movePlayer1Card(id, position)` - same for player 1 cards.
* `movePlayer2Card(id, position)` - same for player 2 cards.

### lobby state:
* `setMyName(name)` - set displayed username
* `setOponnetnsName(name)` - set displayed opponents name

### Callbacks:
* Callbacks are set via Phaser.Signal, which is Phaser's internal event bus implementation.
* For docs see [here](http://phaser.io/docs/2.4.2/Phaser.Signal.html)
* Signal variables are in **globals.js** for now 

Defined events:

* `onAttack`
* `onSpawn`
* `onDeath`
  
Example can be seen in **main.js** file;
API is obviously not complete, so place your feature request right on scrum table in "ToDo" section.  