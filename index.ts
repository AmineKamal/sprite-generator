const imageLoader = document.getElementById("imageLoader");
const canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
let img: HTMLImageElement;
let cellSize: number = 32;
let pointer = false;
let bx: number;
let by: number;
let ex: number;
let ey: number;

interface Manifest {
  [key: string]: Sprite[];
}

interface Sprite {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

let manifest: Manifest = {};
let resource: string;

function handleImage(e: any) {
  var reader = new FileReader();
  reader.onload = function(event) {
    img = new Image();
    img.onload = function() {
      resource = trimFileName(e.target.files[0].name);
      if (!manifest[resource]) manifest[resource] = [];
      redraw();
    };
    img.src = event.target.result as string;
  };
  reader.readAsDataURL(e.target.files[0]);
}

function trimFileName(file: string) {
  const fname = file.split(".")[0];
  const name = fname
    .split("-")
    .map(e => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    })
    .join("");

  return name;
}

function redraw() {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  drawLines(cellSize);
}

function drawLines(size: number) {
  ctx.beginPath();

  const ws = canvas.width / size;
  const hs = canvas.height / size;

  for (let i = 0; i <= canvas.width; i += ws) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }

  for (let i = 0; i <= canvas.height; i += hs) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
  }

  ctx.stroke();
}

function drawHighlight() {
  redraw();

  const fex = Math.ceil(ex / cellSize) * cellSize;
  const fey = Math.ceil(ey / cellSize) * cellSize;
  const fbx = Math.floor(bx / cellSize) * cellSize;
  const fby = Math.floor(by / cellSize) * cellSize;

  const x = fex < fbx ? fex : fbx;
  const y = fey < fby ? fey : fby;
  const w = Math.abs(fex - fbx);
  const h = Math.abs(fey - fby);

  ctx.save();
  ctx.fillStyle = "rgba(0,0,225,0.5)";
  ctx.fillRect(x, y, w, h);
  ctx.restore();

  return { x, y, w, h };
}

function download(filename: string, text: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

imageLoader.addEventListener("change", handleImage, false);

canvas.addEventListener("pointerdown", event => {
  pointer = true;
  bx = event.offsetX;
  by = event.offsetY;
});

canvas.addEventListener("pointermove", event => {
  if (pointer) {
    ex = event.offsetX;
    ey = event.offsetY;
    drawHighlight();
  }
});

canvas.addEventListener("pointerup", event => {
  pointer = false;
  ex = event.offsetX;
  ey = event.offsetY;
  const position = drawHighlight();
  const name = trimFileName(prompt("Enter Sprite Name"));

  if (name) {
    manifest[resource].push({ ...position, name });
    console.log(manifest);
  }

  redraw();
});

document.getElementById("generate").addEventListener("click", () => {
  download("manifest.json", JSON.stringify(manifest, null, 4));
});

document.getElementById("copy").addEventListener("click", () => {
  const keys = Object.keys(manifest);
  keys.splice(keys.indexOf(resource), 1);

  const key = prompt("Choose what resource to copy from: " + keys.join(" | "));

  if (keys.includes(key)) {
    manifest[resource] = JSON.parse(JSON.stringify(manifest[key]));
    console.log(manifest);
  }
});

document.getElementById("preview").addEventListener("click", () => {
  alert(JSON.stringify(manifest, null, 4));
});
