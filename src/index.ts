/// <reference path="canvas.ts" />
/// <reference path="globals.ts" />
/// <reference path="types.ts" />
/// <reference path="utils.ts" />

namespace SpriteGenerator {

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
    download((prompt("Enter a filename.") || "manifest") + ".json", JSON.stringify(manifest, null, 4));
  });

  document.getElementById("copy").addEventListener("click", () => {
    const keys = Object.keys(manifest);
    keys.splice(keys.indexOf(resource), 1);

    const key = prompt("Choose what resource to copy from: " + keys.join(" | "));

    if (keys.indexOf(key) !== -1) {
      manifest[resource] = JSON.parse(JSON.stringify(manifest[key]));
      console.log(manifest);
    }
  });

  document.getElementById("preview").addEventListener("click", () => {
    alert(JSON.stringify(manifest, null, 4));
  });

}