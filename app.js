// image object
let img = new Image();
// image source
let mazeNum = 1;
img.src = img.src = "Mazes/" + mazeNum + ".jpg";
//canvas
let canvas = document.getElementById("canvas");
// canvas context
let ctx = canvas.getContext("2d");

// load the image on canvas and fit dimensions
window.onload = function () {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

// start button is clicked, draw green on the canvas
document.getElementById("start").addEventListener("click", function () {
  canvas.addEventListener("mousedown", function (e) {
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();
  });
});

// finish button is clicked, draw red on the canvas
document.getElementById("finish").addEventListener("click", function () {
  canvas.addEventListener("mousedown", function (e) {
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  });
});

// clear button is clicked, clear the canvas and redraw the image
document.getElementById("clear").addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
});
