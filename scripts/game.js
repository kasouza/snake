class Game {
  constructor() {
    this.grid = new Grid(COLS, ROWS);
    this.snake = new Snake(Math.round(COLS / 2) - 1, Math.round(ROWS / 2) - 1);
    this.startTime = 0;
    this.elapsedTimeThreshold = 150;
    this.fruitsToCreate = 1;
    this.collectedFruits = 0;
    this.commandsStack = [];
  }

  // Just a alias
  start() {
    this.reset();
  }

  reset() {
    this.grid.reset();
    this.snake.reset();

    this.grid.randomFruity();

    requestAnimationFrame((endTime) => this.update(endTime));
  }

  update(endTime) {
    let hasLost = false;

    this.show();

    // This makes the game slower (in a good way!)
    let elapsed = endTime - this.startTime;
    if (elapsed >= this.elapsedTimeThreshold) {
      if (this.commandsStack.length >= 1) {
        this.snake.changeDirection(this.commandsStack.pop());
      }

      let next = this.snake.head;

      while (next) {
        const fruit = this.grid.getCollision(next);

        if (fruit) {
          // Only make the snake grow and create new fruits if a fruit collided
          // with the head, otherwise just deletes the fruit. This is a little
          // hack for when a fruit spawn in the tail of the snake, as it will
          // simply be removed.
          if (next.equals(this.snake.head)) {
            this.grid.removeFruit(fruit);
            
            if (this.grid.fruits.length == 0) {
              for (let i = 0; i < this.fruitsToCreate; i++) {
                this.grid.randomFruity();
              }
              
              if (this.collectedFruits % 2 == 0) {
                this.fruitsToCreate++;
              }
            }

            this.snake.grow();
            // Make the game faster when you collect a fruit
            this.elapsedTimeThreshold = Math.max((this.elapsedTimeThreshold
              * TIME_FACTOR_PER_FRUIT), MIN_ELAPSED_TIME_THRESHOLD);
          } else {
            this.grid.removeFruit(fruit);
            this.grid.randomFruity();
          }
        } 
        next = next.next;
      }

      this.snake.update();

      // Lost the game
      hasLost = this.snake.hasLost();

      this.startTime = endTime;
    }

    if (hasLost) {
      alert("You Lost!");
      this.reset();
    } else {
      requestAnimationFrame((endTime) => this.update(endTime));
    }

  }

  show() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    this.grid.show();
    this.snake.show();
  }
}
