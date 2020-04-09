import {
  TOOL_BRUSH,
  TOOL_ERASER,
  TOOL_PAINT_BUCKET
} from "./tool.js";
import Paint from "./paint.class.js";

var paint = new Paint("canvas");
paint.activeTool = TOOL_PAINT_BUCKET;
paint.lineWidth = 1;
paint.brushSize = 4;
paint.selectedColor = "#000000";
paint.init();

document.querySelectorAll("[data-command]").forEach(item => {
  item.addEventListener("click", e => {
    let command = item.getAttribute("data-command");

    if (command == "undo") {
      paint.undoPaint();
    } else if (command == "download") {
      let canvas = document.getElementById("canvas");
      let image = canvas
        .toDataURL("image/png", 1.0)
        .replace("image/png", "image/octet-stream");

      let linkURL = document.createElement("a");
      linkURL.download = "my-paint.png";
      linkURL.href = image;
      linkURL.click();
    }
  });
});

document.querySelectorAll("[data-tool]").forEach(item => {
  item.addEventListener("click", e => {
    document.querySelector("[data-tool].active").classList.toggle("active");
    item.classList.toggle("active");

    let selectedTool = item.getAttribute("data-tool");
    paint.activeTool = selectedTool;

    switch (selectedTool) {
      case TOOL_BRUSH:
      case TOOL_ERASER:
        // activate brush linewidths group
        document.querySelector(".group.for-brush").style.display = "block";
        break;
      case TOOL_PAINT_BUCKET:
        document.querySelector(".group.for-brush").style.display = "none";
        break;
      default:
        document.getElementById("canvas").style.cursor = "default";
        // make invisible both linewidths group
        document.querySelector(".group.for-brush").style.display = "none";
        break;
    }
  });
});

document.querySelectorAll("[data-line-width]").forEach(item => {
  item.addEventListener("click", e => {
    document
      .querySelector("[data-line-width].active")
      .classList.toggle("active");
    item.classList.toggle("active");

    let lineWidth = item.getAttribute("data-line-width");
    paint.lineWidth = lineWidth;
  });
});

document.querySelectorAll("[data-brush-width]").forEach(item => {
  item.addEventListener("click", e => {
    document
      .querySelector("[data-brush-width].active")
      .classList.toggle("active");
    item.classList.toggle("active");

    let brushSize = item.getAttribute("data-brush-width");
    paint.brushSize = brushSize;
  });
});

document.querySelectorAll("[data-color]").forEach(item => {
  item.addEventListener("click", e => {
    document.querySelector("[data-color].active").classList.toggle("active");
    item.classList.toggle("active");

    let color = item.getAttribute("data-color");
    paint.selectedColor = color;
  });
});


window.onload = function() {
  var input = document.getElementById("input");
  input.addEventListener("change", handleFiles, false);

  // set original canvas dimensions as max
  var canvas = document.getElementById("canvas");
  canvas.dataMaxWidth = canvas.width;
  canvas.dataMaxHeight = canvas.height;
};

function handleFiles(e) {
  var ctx = document.getElementById("canvas").getContext("2d");
  var reader = new FileReader();
  var file = e.target.files[0];
  // load to image to get it's width/height
  var img = new Image();
  img.onload = function() {
    // setup scaled dimensions
    var scaled = getScaledDim(
      img,
      ctx.canvas.dataMaxWidth,
      ctx.canvas.dataMaxHeight
    );
    // scale canvas to image
    ctx.canvas.width = scaled.width;
    ctx.canvas.height = scaled.height;
    // draw image
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
  };
  // this is to setup loading the image
  reader.onloadend = function() {
    img.src = reader.result;
  };
  // this is to read the file
  reader.readAsDataURL(file);
}

// returns scaled dimensions object
function getScaledDim(img, maxWidth, maxHeight) {
  var scaled = {
    ratio: img.width / img.height,
    width: img.width,
    height: img.height
  };
  if (scaled.width > maxWidth) {
    scaled.width = maxWidth;
    scaled.height = scaled.width / scaled.ratio;
  }
  if (scaled.height > maxHeight) {
    scaled.height = maxHeight;
    scaled.width = scaled.height / scaled.ratio;
  }
  console.log(scaled);
  return scaled;
}
