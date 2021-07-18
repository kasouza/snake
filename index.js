const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// This can cause some troubles if the canvas is resized, but in this is case
// it's OK to do it this way
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const SQUARE_SIZE = 10;
const ROWS = Math.floor(WIDTH / SQUARE_SIZE);
const COLS = Math.floor(HEIGHT / SQUARE_SIZE);

function setup() {
	const game = new Game();

	// Put the comamnds in the stack so the snake
	// doesn't need to be a global variable
	window.addEventListener('keydown', (e) => {
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				game.commandsStack.push([0, 1]);
				break;

			case 'ArrowRight':
				e.preventDefault();
				game.commandsStack.push([1, 0]);
				break;

			case 'ArrowDown':
				e.preventDefault();
				game.commandsStack.push([0, -1]);
				break;

			case 'ArrowLeft':
				e.preventDefault();
				game.commandsStack.push([-1, 0]);
				break;

			case 'p':
				e.preventDefault();
				game.togglePause();
				break;
		}
	});

	game.start();
}

window.onload = setup;
