const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// This can cause some troubles if the canvas is resized, but in this is case
// it's OK to do it this way
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const SQUARE_SIZE = 10;
const ROWS = Math.floor(WIDTH / SQUARE_SIZE);
const COLS = Math.floor(HEIGHT / SQUARE_SIZE);

const TIME_FACTOR_PER_FRUIT = 0.99;
const MIN_ELAPSED_TIME_THRESHOLD = 10;

const commandsStack = [];

function GameObject() {
  this.grid = new Grid(COLS, ROWS);
  this.snake = new Snake(Math.round(COLS / 2) - 1, Math.round(ROWS / 2) - 1);
  this.startTime = 0;
  this.elapsedTimeThreshold = 150;
  this.fruitsToCreate = 1;
  this.collectedFruits = 0;
}

function setup() {
  let gameObject = new GameObject();

  gameObject.grid.randomFruity();

  requestAnimationFrame((endTime) => update(gameObject, endTime));
}

function update(gameObject, endTime) {
  let hasLost = false;

  draw(gameObject.grid, gameObject.snake);

  // This makes the game slower (in a good way!)
  elapsed = endTime - gameObject.startTime;
  if (elapsed >= gameObject.elapsedTimeThreshold) {
    if (commandsStack.length >= 1) {
      gameObject.snake.changeDirection(commandsStack.pop());
    }

    let next = gameObject.snake.head;
    while (next) {
      const fruit = gameObject.grid.getCollision(next);
      if (fruit) {
        gameObject.grid.removeFruit(fruit);

        // Only make the snake grow and create new fruits if a fruit collided
        // with the head, otherwise just deletes the fruit. This is a little
        // hack for when a fruit spawn in the tail of the snake, as it will
        // simply be removed.
        if (next === gameObject.snake.head) {
          if (gameObject.grid.fruits.length == 0) {
            for (let i = 0; i < gameObject.fruitsToCreate; i++) {
              gameObject.grid.randomFruity();
            }
            
            if (gameObject.collectedFruits % 2 == 0) {
              gameObject.fruitsToCreate++;
            }
          }

          gameObject.snake.grow();

          // Make the game faster when you collect a fruit
          gameObject.elapsedTimeThreshold = Math.max((gameObject.elapsedTimeThreshold
            * TIME_FACTOR_PER_FRUIT), MIN_ELAPSED_TIME_THRESHOLD);
        }
      }

      next = next.next;
    }

    gameObject.snake.update();

    // Lost the game
    hasLost = gameObject.snake.hasLost();

    gameObject.startTime = endTime;
  }

  if (hasLost) {
    alert("You Lost!");
    setup();
  } else {
    requestAnimationFrame((endTime) => update(gameObject, endTime));
  }
}

function draw(grid, snake) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  grid.show();
  snake.show();
}

// Put the comamnds in the stack so the snake
// doesn't need to be a global variable
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      commandsStack.push([0, 1]);
      break;

    case 'ArrowRight':
      e.preventDefault();
      commandsStack.push([1, 0]);
      break;

    case 'ArrowDown':
      e.preventDefault();
      commandsStack.push([0, -1]);
      break;

    case 'ArrowLeft':
      e.preventDefault();
      commandsStack.push([-1, 0]);
      break;
  }
});

window.onload = setup;
