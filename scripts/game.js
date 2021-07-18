class Game {
	constructor() {
		this.grid = new Grid(COLS, ROWS);
		this.snake = new Snake(Math.round(COLS / 2) - 1, Math.round(ROWS / 2) - 1);

		this.startingTimeThreshold = 150;
		this.startTime = 0;
		this.elapsedTimeThreshold = this.startingTimeThreshold;

		this.fruitsToCreate = 1;
		this.collectedFruits = 0;
		this.counter = new Counter(10, 20);

		this.commandsStack = [];
		this.isPaused = false;

		this.timeFactorPerFruit = 0.95;
		this.minElapsedTimeThreshold = 50;
	}

	// Just an alias
	start() {
		this.reset();
	}

	reset() {
		this.grid.reset();
		this.snake.reset();
		this.counter.reset();

		this.collectedFruits = 0;
		this.fruitsToCreate = 1;
		this.elapsedTimeThreshold = this.startingTimeThreshold;
		this.commandStack = [];

		this.grid.randomFruity();

		// You need to use an arrow function or `bind` the function call to `this` object,
		// otherwise `this` will be undefined in the `update` function!!!
		//
		// Do this:
		// requestAnimationFrame(endTime => this.update(endTime));
		//
		// or this:
		requestAnimationFrame(this.update.bind(this));
	}

	togglePause() {
		this.isPaused = !this.isPaused;

		if (!this.isPaused) {
			requestAnimationFrame(this.update.bind(this));
		}
	}

	update(endTime) {
		if (this.isPaused) {
			return;
		}

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

							this.fruitsToCreate++;
						}

						this.collectedFruits++;

						this.snake.grow();
						// Make the game faster when you collect a fruit
						this.elapsedTimeThreshold = Math.max((this.elapsedTimeThreshold
							* this.timeFactorPerFruit), this.minElapsedTimeThreshold);
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

		this.counter.update(this.collectedFruits);

		if (hasLost) {
			alert("You Lost!");
			this.reset();
		} else {
			requestAnimationFrame(this.update.bind(this));
		}

	}

	show() {
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		this.grid.show();
		this.snake.show();
		this.counter.show();
	}
}
