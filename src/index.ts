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
      manifest[resource][name] = position;
    }

    redraw();
  });

  document.getElementById("generate").addEventListener("click", () => {
    download((prompt("Enter a filename.") || "manifest") + ".json", JSON.stringify(manifest, null, 4));
  });

  document.getElementById("sync").addEventListener("click", () => {
    const keys = Object.keys(manifest);

    keys.forEach((key) => {
      const res = manifest[key];
      const sprites = Object.keys(res);

      sprites.forEach(sp => {
        keys.forEach(k => (manifest[k][sp] = JSON.parse(JSON.stringify(res[sp]))));
      });
    });

    console.log(manifest);

  });

  document.getElementById("preview").addEventListener("click", () => {
    alert(JSON.stringify(manifest, null, 4));
  });

}