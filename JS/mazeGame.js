// global variables
const img = new Image();
let mazeNum = 1;
img.src = `./Styles/Mazes/${mazeNum}.jpg`;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");
let markedGreen = false;
let markedRed = false;
let startedStopwatch = false;

// draw the image on load
img.onload = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  forceBlackAndWhite();
};

// ***** Game Logic *****
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
      "∙ Start drawing a path through the maze by clicking and dragging. <br> ∙ You can only draw from the green entrance marker or from a path that you've already drawn.<br> ∙ You cannot draw through black pixels.";
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
      document.getElementById("stopwatch").style.display = "none";
    }
  }
};
