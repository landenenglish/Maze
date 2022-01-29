// **************************** Utility Functions ************************************

// force the pixels in the canvas either true black or true white
const forceBlackAndWhite = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // for all pixels in the image
  for (let i = 0; i < imgData.data.length; i += 4) {
    // if above or below the threshold
    if (imgData.data[i] > 150) {
      // force white
      imgData.data[i] = 255;
      imgData.data[i + 1] = 255;
      imgData.data[i + 2] = 255;
      imgData.data[i + 3] = 255;
    } else {
      // force black
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
  document.getElementById("saveScore").style.display = "none";
  document.getElementById("stopwatch").style.display = "flex";
  forceBlackAndWhite();
  // I think that's everything?
};

// check the if color of the pixel with coordinates is true
const checkPixelColor = (x, y, color) => {
  return (
    ctx.getImageData(x, y, 1, 1).data[0] === color[0] &&
    ctx.getImageData(x, y, 1, 1).data[1] === color[1] &&
    ctx.getImageData(x, y, 1, 1).data[2] === color[2]
  );
};

// stopwatch logic
let timer;
let seconds = 0;

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
  let stopwatch = document.getElementById("stopwatch");
  stopwatch.innerHTML = ` ${seconds} seconds.`;
};

// Make a circle with the color and coordinates
const makeCircle = (x, y, color) => {
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};

// **************************** Buttons ************************************

// display the high (low time) score for the image source
document.getElementById("highScore").addEventListener("click", () => {
  let key = img.src;
  let highestScore = localStorage.getItem(key);
  if (!highestScore) {
    document.getElementById("message").innerHTML =
      "No score for this maze yet.";
  } else {
    document.getElementById(
      "message"
    ).innerHTML = `The lowest time for this maze is ${highestScore} seconds.`;
  }
});

// save the score for the image and display the high (low time) score
document.getElementById("saveScore").addEventListener("click", () => {
  let score = seconds;
  let key = img.src;
  let highestScore = localStorage.getItem(key);
  if (!highestScore) {
    localStorage.setItem(key, score);
  } else if (score < highestScore) {
    localStorage.setItem(key, score);
  }
  document.getElementById(
    "message"
  ).innerHTML = `Your time is ${seconds} seconds. Lowest time for this maze: ${localStorage.getItem(
    key
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
  document.getElementById("mazeNum").innerHTML = `Maze ${mazeNum}`;
  resetGame();
});

// use image from the user
// needs scaling work maybe
document.getElementById("useOwn").addEventListener("change", (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
    canvas.width = img.width * (500 / img.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    resetGame();
  };
  reader.readAsDataURL(file);
  document.getElementById("mazeNum").innerHTML = `Your Maze`;
});
