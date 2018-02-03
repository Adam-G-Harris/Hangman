window.onload = () => {

	const blankWord = document.getElementById('blank-word'),
		revealWord = document.getElementById('reveal-word'),
		usedLetters = document.getElementById('used-letters'),
		rightLetters = document.getElementById('right-letters'),
		guessesLeft = document.getElementById('guesses-left'),
		easyButton = document.getElementById('button-easy'),
		mediumButton = document.getElementById('button-medium'),
		hardButton = document.getElementById('button-hard'),
		canvasLanding = document.getElementById('canvas-landing'),
		difficultyPage = document.getElementById('difficulty-page'),
		revealLetter = document.getElementsByClassName('reveal-letter');


	; (function () {

		window.addEventListener('keyup', letterGuessed, false);
		window.addEventListener('resize', resize, false);

		easyButton.addEventListener('click', easy);
		mediumButton.addEventListener('click', medium);
		hardButton.addEventListener('click', hard);

		let word,
			lives,
			lettersGuessed,
			lettersGuessedDOM,
			lettersGuessedDOMRight;

		let canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d'),
			amountOfStars = 500,
			stars = [];

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		function resize() {
			let scale = window.devicePixelRatio,
				sizeX = window.innerWidth,
				sizeY = window.innerHeight;
			canvas.style.width = `${sizeX}px`;
			canvas.style.height = `${sizeY}px`;
			canvas.width = sizeX * scale;
			canvas.height = sizeY * scale;
			ctx.scale(scale, scale);
		}

		function Star(x, y, r, n) {
			this.x = this.oldX = x;
			this.y = this.oldY = y;
			this.r = r;
			this.n = n;
			this.dx = getDistanceX(x);
			this.dy = getDistanceY(y);
		}

		Star.prototype.update = function () {
			if (this.x - this.r > window.innerWidth ||
				this.x < 0 - this.r ||
				this.y - this.r > window.innerHeight ||
				this.y < 0 - this.r) {
				stars.splice(stars.indexOf(this), 1);
				makeStarChild();
				return;
			}
			if (getTotalDistance(this.x, this.y, window.innerWidth / 2, window.innerHeight / 2) < window.innerHeight / 3) {
				this.r *= 1.0002;
			}
			this.x += velocityX(this.x, this.r, this.dx);
			this.y += velocityY(this.y, this.r, this.dx);
			this.draw();
		};

		Star.prototype.draw = function () {
			ctx.fillStyle = `rgba(255, 255, 255, ${this.n += this.r * .00025})`;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		};

		function makeStars() {
			let x, y, r, n, num, star;
			for (let i = 0; i < amountOfStars; i++) {
				num = getRandomNum(1, 10);
				num > 9.6 ?
					r = getRandomNum(2, 4) :
					r = getRandomNum(1, 3);
				x = getRandomInt(r, window.innerWidth - r);
				y = getRandomInt(r, window.innerHeight - r);
				n = getRandomNum(0, num / 10);
				star = new Star(x, y, r, n);
				stars.push(star);
			}
		}

		function makeStarChild() {
			let r;
			let num = getRandomNum(1, 10);
			num > 9.6 ?
				r = getRandomNum(2, 4) :
				r = getRandomNum(1, 3);
			let x = getRandomInt(window.innerWidth / 6 + r, window.innerWidth / 1.2 - r);
			let y = getRandomInt(window.innerHeight / 6 + r, window.innerHeight / 1.2 - r);
			let n = getRandomNum(0, num / 10);
			let star = new Star(x, y, r, n);
			stars.push(star);
		}

		function getRandomNum(min, max) {
			return Math.random() * (max - min) + min;
		}

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}

		function getDistanceX(x) {
			if (x < window.innerWidth / 2) {
				return -((window.innerWidth / 2) - x);
			} else {
				return (window.innerWidth / 2) + x - (window.innerWidth);
			}
		}

		function getDistanceY(y) {
			if (y < window.innerHeight / 2) {
				return -((window.innerHeight / 2) - y);
			} else {
				return (window.innerHeight / 2) + y - (window.innerHeight);
			}
		}

		function getTotalDistance(x1, y1, x2, y2) {
			return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
		}

		function velocityX(x, r, dx) {
			if (dx < 0) {
				return getDistanceX(x) / (window.innerHeight / 30) * r * 0.05;
			} else {
				return getDistanceX(x) / (window.innerHeight / 30) * r * 0.05;
			}
		}

		function velocityY(y, r, dy) {
			if (dy < 0) {
				return getDistanceY(y) / (window.innerHeight / 30) * r * 0.05;
			} else {
				return getDistanceY(y) / (window.innerHeight / 30) * r * 0.05;
			}
		}

		function loop() {
			window.requestAnimationFrame(loop);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			stars.forEach(star => {
				star.update();
			});
		}

		function init() {
			makeStars();
			resize();
			loop();
		}

		function gameStart() {

			lives = 8;

			lettersGuessed = [];

			lettersGuessedDOM = [];

			usedLetters.innerHTML = '';

			lettersGuessedDOMRight = [];

			rightLetters.innerHTML = '';

			guessesLeft.textContent = lives;

			revealWord.innerHTML = `<span class='reveal-letter'></span>`.repeat(word.length);

			blankWord.innerHTML = `<span class='blank-letter'>___</span>`.repeat(word.length);
		}

		function letterGuessed(e) {

			if (e.key.match(/[a-z]|[A-Z]/g) && e.key.length === 1) {

				word.indexOf(e.key) !== -1 ? correctGuess(e) : wrongGuess(e);

			} else {

				alert('Only letters are valid.');
			}
		}

		function correctGuess(e) {

			while (word.indexOf(e.key) !== -1) {

				addLetter(e.key);

				word.filter(letter => letter === e.key).length > 1 ? multipleLetters(e, 0) : singleLetter(e);
			}
		}

		function wrongGuess(e) {

			lettersGuessed.indexOf(e.key) === -1 ? addLetter(e.key) : alert(`You've already guessed ${e.key.toUpperCase()}`);
		}

		function addLetter(letter) {

			if (staticWord.indexOf(letter) === -1) {

				lives -= 1;

				guessesLeft.textContent = lives;

				lettersGuessed.push(letter);

				lettersGuessedDOM.push(`<span class='wrong-letter'>${letter.toUpperCase()}</span>`);

				usedLetters.innerHTML = lettersGuessedDOM.join('');

				if (lives === 0) {

					gameOver();

					return;
				}

			} else {

				lettersGuessed.push(letter);

				lettersGuessedDOMRight.push(`<span class='wrong-letter'>${letter.toUpperCase()}</span>`);

				rightLetters.innerHTML = lettersGuessedDOMRight.join('');

				if (lettersGuessedDOMRight.length === new Set(staticWord).size) {

					difficultyPage.style.opacity = '1';

					difficultyPage.style.display = 'flex';

					setTimeout(() => { confirm("You found the entire word! Would you like to play again?") ? gameStart() : donePlaying(); }, 0);
				}
			}
		}

		function multipleLetters(e, count) {

			let staticKeyIndex = staticWord.indexOf(e.key);

			while (word.indexOf(e.key) !== -1) {

				revealLetter[staticWord.indexOf(e.key, staticKeyIndex + count)].textContent = staticWord[staticKeyIndex].toUpperCase();

				word = word.slice(0, word.indexOf(e.key)).concat(word.slice(word.indexOf(e.key) + 1));

				count += 1;
			}
		}

		function singleLetter(e) {

			revealLetter[staticWord.indexOf(e.key)].textContent = staticWord[staticWord.indexOf(e.key)].toUpperCase();

			word = word.slice(0, word.indexOf(e.key)).concat(word.slice(word.indexOf(e.key) + 1));
		}

		function easy() {

			word = staticWord = splitEasy[getRandomInt(0, splitEasy.length)].toLowerCase().split('');

			difficultySelected();

			gameStart();
		}

		function medium() {

			word = staticWord = splitMedium[getRandomInt(0, splitMedium.length)].toLowerCase().split('');

			difficultySelected();

			gameStart();
		}

		function hard() {

			word = staticWord = splitHard[getRandomInt(0, splitHard.length)].toLowerCase().split('');

			difficultySelected();

			gameStart();
		}

		function difficultySelected() {

			init();

			canvasLanding.style.opacity = '0';

			difficultyPage.style.opacity = '0';

			setTimeout(() => {

				canvasLanding.style.display = 'none';

				difficultyPage.style.display = 'none';

			}, 1000);
		}

		function gameOver() {

			canvasLanding.style.opacity = '1';

			canvasLanding.style.display = 'block';

			difficultyPage.style.opacity = '1';

			difficultyPage.style.display = 'flex';

			confirm(`The word was ${staticWord.join('')}... Would you like to play again?`) ? gameStart() : donePlaying();

			return;
		}

		function donePlaying() {

			document.body.textContent = 'Thanks for playing!';

			return;
		}

		let easyWords = 'mile vain flag move deck talk race sell pill save fail pole lung chip soap jury knee sock slam tool pawn coin ward hang good gold mood wave belt bite fire lose tail west myth copy dive year road dump mild gene heat fine peel pace boot fast take rice',
			mediumWords = 'strain spirit sister palace nature safety margin degree coerce fossil camera export flavor growth behead empire stress apathy oppose pigeon preach gravel gutter tiptoe father virtue common embark sailor depart random endure outfit infect breeze church please porter result season cancel cancer admire remain insure kettle powder insert credit extent',
			hardWords = 'motorcycle definition convulsion admiration gregarious memorandum continuous prediction censorship basketball discourage thoughtful engagement resolution unpleasant management conception houseplant appearance mainstream homosexual conscience transition plagiarize remunerate repetition functional productive brilliance occupation population accountant excavation deficiency mastermind permission curriculum disappoint researcher understand straighten microphone simplicity presidency temptation settlement multimedia opposition';

		let splitEasy = easyWords.split(' '),
			splitMedium = mediumWords.split(' '),
			splitHard = hardWords.split(' ');

	})();

	; (function () {

		window.addEventListener('resize', resize, false);

		let ctx = canvasLanding.getContext('2d');

		canvasLanding.width = window.innerWidth;
		canvasLanding.height = window.innerHeight;

		let stars = [];

		function resize() {
			let scale = window.devicePixelRatio,
				sizeX = window.innerWidth,
				sizeY = window.innerHeight;
			canvasLanding.style.width = `${sizeX}px`;
			canvasLanding.style.height = `${sizeY}px`;
			canvasLanding.width = sizeX * scale;
			canvasLanding.height = sizeY * scale;
			ctx.scale(scale, scale);
		}

		function Star(x, y, r, n) {
			this.x = x;
			this.y = y;
			this.r = r;
			this.n = n;
			this.s = 1;
		}

		Star.prototype.update = function () {
			if (this.y > window.innerHeight) {
				delete stars[stars.indexOf(this)];
				return;
			}
			this.y += getDistance(this.x) / (window.innerWidth / 2) + this.r + 5;
			this.draw();
		};

		Star.prototype.draw = function () {
			ctx.fillStyle = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${this.n})`;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		};

		function makeStars() {
			let x, y, r, n, num, star;
			for (let i = 0; i < 1000; i++) {
				num = getRandomNum(1, 10);
				num > 9.6 ? r = getRandomNum(2, 4) : r = getRandomNum(1, 3);
				x = getRandomInt(r, canvasLanding.width - r);
				y = getRandomInt(r, canvasLanding.height - r);
				n = getRandomNum(0, num / 10);
				star = new Star(x, y, r, n);
				stars.push(star);
			}
		}

		function getRandomNum(min, max) {
			return Math.random() * (max - min) + min;
		}

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}

		function getDistance(x) {
			if (x < window.innerWidth / 2) {
				return -((window.innerWidth / 2) - x);
			} else {
				return (window.innerWidth / 2) + x - (window.innerWidth);
			}
		}

		function loop() {
			window.requestAnimationFrame(loop);
			stars.forEach(star => {
				star.update();
			});
		}

		function init() {
			makeStars();
			resize();
			loop();
		}

		init();

	})();

}