import {
  TOOL_PENCIL,
  TOOL_BRUSH,
  TOOL_PAINT_BUCKET,
  TOOL_ERASER
} from "./tool.js";
import { getMouseCoordsOnCanvas } from "./utility.js";
import Fill from "./fill.class.js";

export default class Paint {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = canvas.getContext("2d");
    this.undoStack = [];
    this.undoLimit = 15;
  }

  set selectedImage(imgUrl) {
    this.imgUrl = imgUrl;
  }

  set activeTool(tool) {
    this.tool = tool;
  }

  set lineWidth(width) {
    this._lineWidth = width;
    this.context.lineWidth = this._lineWidth;
  }

  set brushSize(size) {
    this._brushSize = size;
  }

  set selectedColor(color) {
    this.color = color;
    this.context.strokeStyle = this.color;
  }

  init() {
    this.canvas.onmousedown = e => this.onMouseDown(e);
  }

  onMouseDown(e) {
    this.savedData = this.context.getImageData(
      0,
      0,
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );

    if (this.undoStack.length >= this.undoLimit) this.undoStack.shift();
    this.undoStack.push(this.savedData);

    this.canvas.onmousemove = e => this.onMouseMove(e);
    document.onmouseup = e => this.onMouseUp(e);

    this.startPos = getMouseCoordsOnCanvas(e, canvas);

    if (this.tool == TOOL_PENCIL || this.tool == TOOL_BRUSH) {
      this.context.beginPath();
      this.context.moveTo(this.startPos.x, this.startPos.y);
    } else if (this.tool == TOOL_PAINT_BUCKET) {
      // fill color
      new Fill(this.canvas, this.startPos, this.color);
    } else if (this.tool == TOOL_ERASER) {
      this.eraseRect(this.startPos);
    }
  }

  onMouseMove(e) {
    this.currentPos = getMouseCoordsOnCanvas(e, canvas);

    switch (this.tool) {
      case TOOL_PENCIL:
        this.drawFreeLine(this._lineWidth);
        break;
      case TOOL_BRUSH:
        this.drawFreeLine(this._brushSize);
        break;
      case TOOL_ERASER:
        this.eraseRect(this.currentPos);
        break;
      default:
        break;
    }
  }

  onMouseUp(e) {
    this.canvas.onmousemove = null;
    document.onmouseup = null;
  }

  drawFreeLine(lineWidth) {
    this.context.lineWidth = lineWidth;
    this.context.lineTo(this.currentPos.x, this.currentPos.y);
    this.context.stroke();
  }

  eraseRect(pos) {
    this.context.clearRect(pos.x, pos.y, this._brushSize, this._brushSize);
  }

  undoPaint() {
    if (this.undoStack.length > 0) {
      this.context.putImageData(
        this.undoStack[this.undoStack.length - 1],
        0,
        0
      );
      // remove last element on the array
      this.undoStack.pop();
    }
  }
}
