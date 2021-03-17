const settings = {
  rowsCount: 21,
  colsCount: 21,
  speed: 2,
  wallTimer: 5,
  winFoodCount: 50,
  gameInitialScore: 0,
};
const config = {
  settings,

  init(userSettings) {
    Object.assign(this.settings, userSettings);
  },

  getRowsCount() {
    return this.settings.rowsCount;
  },

  getColsCount() {
    return this.settings.colsCount;
  },

  getSpeed() {
    return this.settings.speed;
  },

  getWinFoodCount() {
    return this.settings.winFoodCount;
  },

  getWallTimer() {
    return this.settings.wallTimer;
  },

  getInitialGameScore() {
    return this.settings.gameInitialScore;
  },

  validate() {
    const result = {
      isValid: true,
      error: [],
    };

    if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30]."
      );
    }

    if (this.getColsCount() < 10 || this.getColsCount() > 30) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки, значение colsCount должно быть в диапазоне [10, 30]."
      );
    }

    if (this.getSpeed() < 1 || this.getSpeed() > 10) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки, значение speed должно быть в диапазоне [1, 10]."
      );
    }

    if (this.getWallTimer() < 1 || this.getWallTimer() > 100) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки, значение wallTimer должно быть в диапазоне [1000, 100000]."
      );
    }

    if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки, значение winFoodCount должно быть в диапазоне [5, 50]."
      );
    }

    if (this.getInitialGameScore() !== 0) {
      result.isValid = false;
      result.errors.push(
        "Неверные настройки, значение gameScore должно быть в диапазоне [0, 0]."
      );
    }

    return result;
  },
};

const map = {
  cells: null,
  usedCells: null,

  init(rowsCount, colsCount) {
    const table = document.getElementById("game");
    table.innerHTML = "";

    this.cells = {}; // {x1_y1: td, x1_y2: td}
    this.usedCells = [];

    for (let row = 0; row < rowsCount; row++) {
      const tr = document.createElement("tr");
      tr.classList.add("row");
      table.appendChild(tr);

      for (let col = 0; col < colsCount; col++) {
        const td = document.createElement("td");
        td.classList.add("cell");
        tr.appendChild(td);

        this.cells[`x${col}_y${row}`] = td;
      }
    }
    console.log(this.cells);
  },

  render(snakePointsArray, foodPoint, wallPoint) {
    for (const cell of this.usedCells) {
      cell.className = "cell";
    }

    this.usedCells = [];

    snakePointsArray.forEach((point, index) => {
      const snakeCell = this.cells[`x${point.x}_y${point.y}`];

      snakeCell.classList.add(index === 0 ? "snakeHead" : "snakeBody");
      this.usedCells.push(snakeCell);
    });

    const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
    const wallCell = this.cells[`x${wallPoint.x}_y${wallPoint.y}`];

    foodCell.classList.add("food");
    wallCell.classList.add("wall");
    this.usedCells.push(foodCell);
    this.usedCells.push(wallCell);
  },
};

const snake = {
  body: null,
  direction: null,
  lastStepDirection: null,

  init(startBody, direction) {
    this.body = startBody;
    this.direction = direction;
    this.lastStepDirection = direction;
  },

  getBody() {
    return this.body;
  },

  getLastStepDirection() {
    return this.lastStepDirection;
  },

  isOnPoint(point) {
    return this.body.some(
      (snakePoint) => snakePoint.x === point.x && snakePoint.y === point.y
    );
  },

  makeStep() {
    this.lastStepDirection = this.direction;
    this.body.unshift(this.getNextStepHeadPoint()); // [p3, p2, p1] => [p4, p3, p2]
    this.body.pop();
  },

  growUp() {
    const lastBodyIndex = this.body.length - 1;
    const lastBodyPoint = this.body[lastBodyIndex];
    this.body.push(lastBodyPoint);
  },

  getNextStepHeadPoint() {
    const headPoint = this.body[0];

    switch (this.direction) {
      case "up":
        return { x: headPoint.x, y: headPoint.y - 1 };
      case "right":
        return { x: headPoint.x + 1, y: headPoint.y };
      case "down":
        return { x: headPoint.x, y: headPoint.y + 1 };
      case "left":
        return { x: headPoint.x - 1, y: headPoint.y };
    }
  },

  setDirection(direction) {
    this.direction = direction;
  },
};

const food = {
  x: null,
  y: null,

  getCoordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  },

  setCoordinates(point) {
    this.x = point.x;
    this.y = point.y;
  },

  isOnPoint(point) {
    return this.x === point.x && this.y === point.y;
  },
};

const wall = {
  x: null,
  y: null,

  getCoordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  },

  setCoordinates(point) {
    this.x = point.x;
    this.y = point.y;
  },

  isOnPoint(point) {
    return this.x === point.x && this.y === point.y;
  },
};

const score = {
  scoreScreen: null,
  gameScore: null,

  init() {
    this.gameScore = config.getInitialGameScore();
    this.scoreScreen = document.querySelector(".score_nums");
  },

  updateScore() {
    this.gameScore++;
  },

  render() {
    this.scoreScreen.innerText = "Your score: " + this.gameScore;
  },

  resetScore() {
    this.gameScore = config.getInitialGameScore();
  },
};

const status = {
  condition: null,

  setPlaying() {
    this.condition = "playing";
  },

  setStopped() {
    this.condition = "stopped";
  },

  setFinished() {
    this.condition = "finished";
  },

  isPlaying() {
    return this.condition === "playing";
  },

  isStopped() {
    return this.condition === "stopped";
  },
};

const game = {
  config,
  map,
  snake,
  food,
  wall,
  score,
  status,
  tickInterval: null,
  wallLifeInterval: null,

  init(userSettings) {
    //closure example here
    const _setEventHandlers = () => {
      document.getElementById("playButton").addEventListener("click", () => {
        this.playClickHandler();
      });
      document.getElementById("newGameButton").addEventListener("click", () => {
        this.newGameClickHandler();
      });
      // document.getElementById('newGameButton').addEventListener('click', this.newGameClickHandler.bind(this));
      document.addEventListener("keydown", (event) => {
        this.keyDownHandler(event);
      });
    };

    // init body
    this.config.init(userSettings);
    const validation = this.config.validate();

    if (!validation.isValid) {
      for (const err of validation.errors) {
        console.log(err);
      }

      return;
    }

    this.map.init(this.config.getRowsCount(), this.config.getColsCount());
    this.score.init();

    _setEventHandlers();
    this.reset();
  },

  reset() {
    this.stop();
    this.snake.init(this.getStartSnakeBody(), "up");
    this.food.setCoordinates(this.getRandomFreeCoordinates());
    this.wall.setCoordinates(this.getRandomFreeCoordinates());
    this.score.resetScore();
    this.render();
  },

  playClickHandler() {
    if (this.status.isPlaying()) this.stop();
    else if (this.status.isStopped()) this.play();
  },

  newGameClickHandler() {
    this.reset();
  },

  keyDownHandler(event) {
    if (!this.status.isPlaying()) return;

    const direction = this.getDirectionByCode(event.code);

    if (this.canSetDirection(direction)) this.snake.setDirection(direction);
  },

  getDirectionByCode(code) {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
        return "up";
      case "KeyD":
      case "ArrowRight":
        return "right";
      case "KeyS":
      case "ArrowDown":
        return "down";
      case "KeyA":
      case "ArrowLeft":
        return "left";
      default:
        return "";
    }
  },

  canSetDirection(direction) {
    const lastStepDirection = this.snake.getLastStepDirection();

    return (
      (direction === "up" && lastStepDirection !== "down") ||
      (direction === "right" && lastStepDirection !== "left") ||
      (direction === "down" && lastStepDirection !== "up") ||
      (direction === "left" && lastStepDirection !== "right")
    );
  },

  getStartSnakeBody() {
    return [
      {
        x: Math.floor(this.config.getColsCount() / 2),
        y: Math.floor(this.config.getRowsCount() / 2),
      },
    ];
  },

  getRandomFreeCoordinates() {
    const exclude = [
      this.food.getCoordinates(),
      this.wall.getCoordinates(),
      ...this.snake.getBody(),
    ];
    // without ... -  [{}, [{}, {}, {}]] => with ... [{}, {}, {}, {}];
    while (true) {
      const rndPoint = {
        x: Math.floor(Math.random() * this.config.getColsCount()),
        y: Math.floor(Math.random() * this.config.getRowsCount()),
      };

      if (
        !exclude.some((exPoint) => {
          return rndPoint.x === exPoint.x && rndPoint.y === exPoint.y;
        })
      )
        return rndPoint;
    }
  },

  render() {
    this.map.render(
      this.snake.getBody(),
      this.food.getCoordinates(),
      this.wall.getCoordinates()
    );
  },

  play() {
    this.status.setPlaying();
    this.tickInterval = setInterval(() => {
      this.tickHandler();
    }, 1000 / this.config.getSpeed());
    this.wallLifeInterval = setInterval(() => {
      this.wallHandler();
    }, 1000 * this.config.getWallTimer());
    this.setPlayButton("Стоп");
  },

  stop() {
    this.status.setStopped();
    clearInterval(this.tickInterval);
    clearInterval(this.wallLifeInterval);
    this.setPlayButton("Старт");
  },

  finish() {
    this.status.setFinished();
    clearInterval(this.tickInterval);
    clearInterval(this.wallLifeInterval);
    this.setPlayButton("Игра закончена", true);
  },

  setPlayButton(text, isDisabled = false) {
    const playButton = document.getElementById("playButton");

    playButton.textContent = text;
    isDisabled
      ? playButton.classList.add("disabled")
      : playButton.classList.remove("disabled");
  },

  tickHandler() {
    if (!this.canMakeStep()) return this.finish();

    if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
      this.snake.growUp();
      this.food.setCoordinates(this.getRandomFreeCoordinates());
      this.score.updateScore();

      if (this.isGameWon()) this.finish();
    }

    if (this.wall.isOnPoint(this.snake.getNextStepHeadPoint())) this.finish();

    this.score.render();
    this.snake.makeStep();
    this.render();
  },

  wallHandler() {
    this.wall.setCoordinates(this.getRandomFreeCoordinates());
  },

  gameTimerHandler() {
    this.timer.update();
  },

  canMakeStep() {
    const nextStepPoint = this.snake.getNextStepHeadPoint();

    return (
      !this.snake.isOnPoint(nextStepPoint) &&
      nextStepPoint.x < this.config.getColsCount() &&
      nextStepPoint.y < this.config.getRowsCount() &&
      nextStepPoint.x >= 0 &&
      nextStepPoint.y >= 0
    );
  },

  isGameWon() {
    return this.snake.getBody().length > this.config.getWinFoodCount();
  },
};

game.init({ speed: 5 });
