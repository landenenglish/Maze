// global variables
const img = new Image();
let mazeNum = 1;
img.src = `./Mazes/${mazeNum}.jpg`;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let markedGreen = false;
let markedRed = false;
let startedStopwatch = false;
const message = document.getElementById("message");
message.innerHTML =
  "Mark the starting location by clicking an entrance on the maze image.";

// draw the image on load
img.onload = function () {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  blackWhite();
};

// cycle through the maze images
document.getElementById("newMaze").addEventListener("click", () => {
  if (mazeNum < 10) {
    mazeNum++;
  } else {
    mazeNum = 1;
  }
  img.src = `./Mazes/${mazeNum}.jpg`;
  reset();
});

// use image from the user
document.getElementById("useOwn").addEventListener("change", (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
    reset();
  };
  reader.readAsDataURL(file);
});

// mark the starting location with a green circle
canvas.addEventListener("click", (e) => {
  if (!markedGreen) {
    // make function
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fill();
    markedGreen = true;
    message.innerHTML =
      "Mark the ending location by clicking an exit on the maze image.";
  } else if (!markedRed) {
    // mark the ending location with a red circle
    // make function
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fill();
    markedRed = true;
    message.innerHTML =
      "Start drawing a path through the maze by clicking and dragging. You can only draw from the green entrance marker or from a path that you've already drawn. You cannot draw through black pixels.";
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (markedGreen && markedRed) {
    const isGreen =
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[0] === 0 &&
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[1] === 255 &&
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[2] === 0;
    const isBlue =
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[0] === 0 &&
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[1] === 0 &&
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[2] === 255;

    if (isBlue || isGreen) {
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      canvas.addEventListener("mousemove", draw);
    }
  }
});

// remvove drawing when the mouse is released
canvas.addEventListener("mouseup", () => {
  if (markedGreen && markedRed) {
    canvas.removeEventListener("mousemove", draw);
  }
});

// draw logic
function draw(e) {
  if (markedGreen && markedRed) {
    if (
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[0] === 0 &&
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[1] === 0 &&
      ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[2] === 0
    ) {
      canvas.removeEventListener("mousemove", draw);
    } else {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 4;
      ctx.stroke();

      if (!startedStopwatch) {
        // start the stopwatch
        startTimer();
        startedStopwatch = true;
      }

      if (
        ctx.getImageData(e.offsetX, e.offsetY, 5, 5).data[0] === 255 &&
        ctx.getImageData(e.offsetX, e.offsetY, 5, 5).data[1] === 0 &&
        ctx.getImageData(e.offsetX, e.offsetY, 5, 5).data[2] === 0
      ) {
        stopTimer();
        message.innerHTML = `You have completed the maze in ${seconds} seconds!`;
        // unhide the save button
        document.getElementById("saveScore").style.display = "block";
      }
    }
  }
}

// stopwatch logic
let timer;
let seconds = 0;
let stopwatch = document.getElementById("stopwatch");
function startTimer() {
  timer = setInterval(() => {
    seconds++;
    displayTime();
  }, 1000);
}

// function stopTimer() {

// }

const stopTimer = () => {
  clearInterval(timer);
};

// display the time in the message box
function displayTime() {
  stopwatch.innerHTML = ` ${seconds} seconds.`;
}

// save the score for the image and display the high score
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

// display the high (low) score for the image source
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

// reset
document.getElementById("reset").addEventListener("click", () => {
  reset();
});
function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stopwatch.innerHTML = "";
  message.innerHTML =
    "Mark the starting location by clicking an entrance on the maze image.";
  seconds = 0;
  stopTimer();
  startedStopwatch = false;
  markedGreen = false;
  markedRed = false;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  blackWhite();
}

// make the pixels in the canvas either black or white
// descriptive convertBoardToBlackAndWhite
function blackWhite() {
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    if (imgData.data[i] > 80) {
      // function
      imgData.data[i] = 255;
      imgData.data[i + 1] = 255;
      imgData.data[i + 2] = 255;
      imgData.data[i + 3] = 255;
    } else {
      imgData.data[i] = 0;
      imgData.data[i + 1] = 0;
      imgData.data[i + 2] = 0;
      imgData.data[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}
