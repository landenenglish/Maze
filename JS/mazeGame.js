// global variables
const img = new Image();
let mazeNum = 1;
img.src = `./Styles/Mazes/${mazeNum}.jpg`;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");
message.innerHTML =
  "Mark the starting location by clicking an entrance on the maze image.";
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
    // mark the starting location with a green circle
    makeCircle(e.offsetX, e.offsetY, "rgb(0, 255, 0)");
    markedGreen = true;
    message.innerHTML =
      "Mark the ending location by clicking an exit on the maze image.";
  } else if (!markedRed) {
    // mark the ending location with a red circle
    makeCircle(e.offsetX, e.offsetY, "rgb(255, 0, 0)");
    markedRed = true;
    message.innerHTML =
      "∙ Start drawing a path through the maze by clicking and dragging. <br><br> ∙ You can only draw from the green entrance marker or from a path that you've already drawn.<br><br> ∙ You cannot draw through black pixels.";
  }
});

// once the entrance and exit have been marked, allow drawing
canvas.addEventListener("mousedown", (e) => {
  if (markedGreen && markedRed) {
    const isGreen = checkPixelColor(e.offsetX, e.offsetY, [0, 255, 0]);
    const isBlue = checkPixelColor(e.offsetX, e.offsetY, [0, 0, 255]);

    // can only begin drawing on green or blue pixels
    if (isBlue || isGreen) {
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      canvas.addEventListener("mousemove", draw);
    }
  }
});

// remove drawing when the mouse is released
canvas.addEventListener("mouseup", () => {
  if (markedGreen && markedRed) {
    canvas.removeEventListener("mousemove", draw);
  }
});

// draw logic
const draw = (e) => {
  if (markedGreen && markedRed) {
    // check if the pixel is black and stop drawing if it is
    if (checkPixelColor(e.offsetX, e.offsetY, [0, 0, 0])) {
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
      if (checkPixelColor(e.offsetX, e.offsetY, [255, 0, 0])) {
        stopTimer();
        message.innerHTML = `You have completed the maze in ${seconds} seconds!`;
        // unhide the save score button
        document.getElementById("saveScore").style.display = "block";
      }
    }
  }
};
