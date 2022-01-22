let img = new Image();
img.src = "Mazes/1.jpg";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

window.onload = function () {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
