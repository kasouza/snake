class Snake {
  constructor(x, y) {
    this.head = new Section(x, y, [1, 0]);
  }

  hasLost() {
    let next = this.head.next;

    // Has the snake hit the wall?
    if (this.head.x < 0 || this.head.x > COLS - 1 ||
        this.head.y < 0 || this.head.y > ROWS - 1) {
      return true;
    }

    while (next) {
      // Has the snake hit itself?
      if (this.head.x == next.x && this.head.y == next.y) {
        return true;
      }
      next = next.next;
    }

    return false;
  }

  grow() {
    this.head.addSection();
  }

  changeDirection(direction) {
    this.head.changeDirection(direction);
  }

  update() {
    this.head.update(this.direction);
  }

  show() {
    this.head.show();
  }
}
