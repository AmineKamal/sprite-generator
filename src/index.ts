/// <reference path="canvas.ts" />
/// <reference path="globals.ts" />
/// <reference path="types.ts" />
/// <reference path="utils.ts" />
/// <reference path="alerts.ts" />
/// <reference path="storage.ts" />
/// <reference path="dom.ts" />

namespace SpriteGenerator {

  Globals.imageLoader.addEventListener("change", Canvas.handleImage, false);

  Globals.canvas.addEventListener("pointerdown", event => {
    Globals.pointer = true;
    Globals.bx = event.offsetX;
    Globals.by = event.offsetY;
  });

  Globals.canvas.addEventListener("pointermove", event => {
    if (Globals.pointer) {
      Globals.ex = event.offsetX;
      Globals.ey = event.offsetY;
      Canvas.drawHighlight();
    }
  });

  Globals.canvas.addEventListener("pointerup", event => {
    Globals.pointer = false;
    Globals.ex = event.offsetX;
    Globals.ey = event.offsetY;
    const position = Canvas.drawHighlight();
    const name = Utils.trimFileName(prompt("Enter Sprite Name"));

    if (name) {
      Globals.manifest[Globals.resource][name] = position;
    }

    Canvas.redraw();
  });

  document.getElementById("generate").addEventListener("click", () => {
    Utils.download((prompt("Enter a filename.") || "manifest") + ".json", JSON.stringify(Globals.manifest, null, 4));
  });

  document.getElementById("sync").addEventListener("click", () => {
    Utils.sync();
  });

  document.getElementById("preview").addEventListener("click", async () => {
    Alerts.json("Preview", Globals.manifest).alert();
  });

  document.getElementById("cell-x").addEventListener("change", () => {
    const val = (document.getElementById("cell-x") as HTMLInputElement).value;
    Globals.cellSizeX = parseInt(val);
    if (Globals.img) Canvas.redraw();
  });

  document.getElementById("cell-y").addEventListener("change", () => {
    const val = (document.getElementById("cell-y") as HTMLInputElement).value;
    Globals.cellSizeY = parseInt(val);
    if (Globals.img) Canvas.redraw();
  });

  document.getElementById("new-template").addEventListener("click", async () => {
    const content = await Alerts.promptModal("Enter Template Here");
    if (!content) return;

    const name = prompt("Enter Template Name");
    if (!name) return;

    await Storage.upload(name, content);
    
    Dom.fillTemplates();
  });

  document.getElementById("save").addEventListener("click", async () => {
    const content = JSON.stringify(Globals.manifest[Globals.resource], null, 4);
    const response = await Alerts.confirmModal("Would you like to save this template?", content);

    if (!response) return;

    const name = prompt("Enter Template Name");
    if (!name) return;

    await Storage.upload(name, content);
    
    Dom.fillTemplates();
  });

  Dom.fillTemplates();
}