class Section {
	constructor(x, y, direction) {
		this.x = x;
		this.y = y;

		this.direction = direction;
		this.next = null;
	}

	equals(other) {
		return this.x == other.x && this.y == other.y;
	}

	reset(x, y) {
		this.next = null;
		this.x = x;
		this.y = y;
	}

	addSection() {
		if (this.next) {
			this.next.addSection();
		} else {
			this.next = new Section(this.x - this.direction[0], this.y + this.direction[1],
				this.direction);
		}
	}

	changeDirection(direction) {
		// As the snake can move only in one direction, one elements of
		// `this.direction` and `direction`(input), will always be 0.
		// For example, if you are going left, `this.direction` === [1, 0].
		// If you try to do a 180 degrees turn,
		// `this.direction[0]` - `direction[0]` === `0`
		const dirX = this.direction[0] + direction[0];
		const dirY = this.direction[1] + direction[1];

		// Soooo... if both dirX and dirY are `0`, it means you're trying to go
		// backwards, ang you can't do that!!!
		if (!(dirX == 0 && dirY == 0)) {
			this.direction = direction;
		}
	}

	update() {
		this.x = this.x + this.direction[0];
		this.y = this.y - this.direction[1];

		if (this.next) {
			this.next.update();

			if (this.next.direction && this.direction) {
				this.next.changeDirection(this.direction);
			}
		}
	}

	show() {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x * SQUARE_SIZE, this.y * SQUARE_SIZE,
			SQUARE_SIZE, SQUARE_SIZE);

		if (this.next) {
			this.next.show();
		}
	}
}
