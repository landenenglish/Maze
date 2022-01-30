// global variables
const img = new Image();
let mazeNum = 1;
img.src = `./Styles/Mazes/${mazeNum}.jpg`;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");
const stopwatch = document.getElementById("stopwatch");
const mazeNumDisplay = document.getElementById("mazeNum");
const saveScoreButton = document.getElementById("saveScore");
let timer;
let seconds = 0;
let markedGreen = false;
let markedRed = false;
let startedStopwatch = false;

// draw the image on load
img.onload = () => {
  drawImage();
  forceBlackAndWhite();
};

// ***************** Game Logic *****************
canvas.addEventListener("click", (e) => {
  if (!markedGreen) {
    // mark the starting location with a green circle if it is not already marked
    makeCircle(e.offsetX, e.offsetY, "rgb(0, 255, 0)");
    markedGreen = true;
    message.innerHTML =
      "Mark the ending location by clicking an exit on the maze image.";
  } else if (!markedRed) {
    // mark the ending location with a red circle if it is not already marked
    makeCircle(e.offsetX, e.offsetY, "rgb(255, 0, 0)");
    markedRed = true;
    message.innerHTML =
      "∙ Start drawing a path through the maze by clicking and dragging. <br><br> ∙ You can only draw from the green entrance marker or from a path that you've already drawn.<br><br> ∙ You cannot draw through black pixels.";
  }
});

// once the starting and ending locations have been marked, allow drawing if starting from green or blue
canvas.addEventListener("mousedown", (e) => {
  if (markedGreen && markedRed) {
    const isGreen = checkPixelColor(e.offsetX, e.offsetY, [0, 255, 0]);
    const isBlue = checkPixelColor(e.offsetX, e.offsetY, [0, 0, 255]);

    if (isBlue || isGreen) {
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      canvas.addEventListener("mousemove", draw);
    }
  }
});

// remove drawing when the mouse is released
canvas.addEventListener("mouseup", () => {
  canvas.removeEventListener("mousemove", draw);
});

// draw logic
const draw = (e) => {
  const isBlack = checkPixelColor(e.offsetX, e.offsetY, [0, 0, 0]);
  const isRed = checkPixelColor(e.offsetX, e.offsetY, [255, 0, 0]);

  // check if the pixel is black and stop drawing if it is
  if (isBlack) {
    canvas.removeEventListener("mousemove", draw);
  } else {
    // allow drawing
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;
    ctx.stroke();

    // start the stopwatch once when drawing begins
    if (!startedStopwatch) {
      startTimer();
      startedStopwatch = true;
    }

    // stop the stopwatch once the user reaches red pixel and display completion message
    if (isRed) {
      stopTimer();
      message.innerHTML = `You have completed the maze in ${seconds} seconds!`;
      // unhide the save score button
      document.getElementById("saveScore").style.display = "block";
      // hide the stopwatch
      stopwatch.style.display = "none";
    }
  }
};

// **************************** Buttons ************************************
// I should refactor into multiple files

// display the high (low time) score for the image source
document.getElementById("highScore").addEventListener("click", () => {
  let highestScore = localStorage.getItem(img.src);
  if (!highestScore) {
    message.innerHTML = "No score for this maze yet.";
  } else {
    message.innerHTML = `The lowest time for this maze is ${highestScore} seconds.`;
  }
});

// save the score for the image and display the high (low time) score
document.getElementById("saveScore").addEventListener("click", () => {
  let highestScore = localStorage.getItem(img.src);
  if (!highestScore || seconds < highestScore) {
    localStorage.setItem(img.src, seconds);
  }
  message.innerHTML = `Your time is ${seconds} seconds. Lowest time for this maze: ${localStorage.getItem(
    img.src
  )} seconds.`;
});

// reset button
document.getElementById("reset").addEventListener("click", () => {
  resetGame();
});

// cycle through the maze images
document.getElementById("newMaze").addEventListener("click", () => {
  if (mazeNum < 10) {
    mazeNum++;
  } else {
    mazeNum = 1;
  }
  canvas.height = "500";
  canvas.width = "500";
  img.src = `./Styles/Mazes/${mazeNum}.jpg`;
  mazeNumDisplay.innerHTML = `Maze ${mazeNum}`;
  resetGame();
});

// use image from the user
// needs scaling work
document.getElementById("useOwn").addEventListener("change", (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
    canvas.width = img.width * (500 / img.height);
    resetGame();
  };
  reader.readAsDataURL(file);
  mazeNumDisplay.innerHTML = `Your image`;
});

// **************************** Helper Functions ************************************
// I should refactor into multiple files

// check if the user's devices uses touch screen or cursor
// try to implement this in the future
const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints;
};

// draw image
const drawImage = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

// force the pixels in the canvas either true black or true white
const forceBlackAndWhite = () => {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // for all pixels in the image
  for (let i = 0; i < imgData.data.length; i += 4) {
    // if above or below the threshold
    if (imgData.data[i] > 150) {
      // force true white
      imgData.data[i] = 255;
      imgData.data[i + 1] = 255;
      imgData.data[i + 2] = 255;
      imgData.data[i + 3] = 255;
    } else {
      // force true black
      imgData.data[i] = 0;
      imgData.data[i + 1] = 0;
      imgData.data[i + 2] = 0;
      imgData.data[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
};

// Resets the canvas and variables
const resetGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stopwatch.innerHTML = "";
  message.innerHTML =
    "Mark the starting location by clicking an entrance on the maze image.";
  stopTimer();
  seconds = 0;
  startedStopwatch = false;
  markedGreen = false;
  markedRed = false;
  saveScoreButton.style.display = "none";
  stopwatch.style.display = "flex";
  drawImage();
  forceBlackAndWhite();
  // I think that's everything
};

// check the if color of the pixel with coordinates is true
const checkPixelColor = (x, y, color) => {
  return (
    ctx.getImageData(x, y, 1, 1).data[0] === color[0] &&
    ctx.getImageData(x, y, 1, 1).data[1] === color[1] &&
    ctx.getImageData(x, y, 1, 1).data[2] === color[2]
  );
};

// start the stopwatch
const startTimer = () => {
  timer = setInterval(() => {
    seconds++;
    displayTime();
  }, 1000);
};

// stop the stopwatch
const stopTimer = () => {
  clearInterval(timer);
};

// display the time in the message box
const displayTime = () => {
  stopwatch.innerHTML = ` ${seconds} seconds.`;
};

// Make a circle with the color and coordinates
const makeCircle = (x, y, color) => {
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};
