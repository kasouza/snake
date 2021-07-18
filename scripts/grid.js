class Fruit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(other) {
    return this.x == other.x && this.y == other.y;
  }

  collidedWith(snake) {
    return this.x == snake.x && this.y == snake.y;
  }

  show() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x * SQUARE_SIZE, this.y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
  }
}

class Grid {
  constructor() {
    this.fruits = [];
  }

  reset() {
    this.fruits = [];
  }

  removeFruit(fruit) {
    this.fruits = this.fruits.filter(other => !fruit.equals(other));
  }

  randomFruity() {
    const x = Math.floor(Math.random() * (COLS - 1));
    const y = Math.floor(Math.random() * (ROWS - 1));

    const index = this.fruits.length;
    this.fruits.push(new Fruit(x, y, index));
  }

  getCollision(snake) {
    return this.fruits.filter(fruit => fruit.collidedWith(snake))[0];
  }

  show() {
    this.fruits.forEach(fruit => fruit.show());
  }
}
