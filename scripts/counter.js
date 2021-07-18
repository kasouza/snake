class Counter {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.count = 0;
	}

	reset() {
		this.count = 0;
	}

	update(count) {
		this.count = count;
	}

	show() {
		ctx.fillStyle = 'white';
		ctx.fillText(this.count, this.x, this.y);
	}
}
