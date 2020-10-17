var SpriteGenerator;
(function (SpriteGenerator) {
    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            SpriteGenerator.img = new Image();
            SpriteGenerator.img.onload = function () {
                SpriteGenerator.resource = SpriteGenerator.trimFileName(e.target.files[0].name);
                if (!SpriteGenerator.manifest[SpriteGenerator.resource])
                    SpriteGenerator.manifest[SpriteGenerator.resource] = {};
                redraw();
            };
            SpriteGenerator.img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }
    SpriteGenerator.handleImage = handleImage;
    function redraw() {
        SpriteGenerator.canvas.width = SpriteGenerator.img.width;
        SpriteGenerator.canvas.height = SpriteGenerator.img.height;
        SpriteGenerator.ctx.drawImage(SpriteGenerator.img, 0, 0);
        drawLines(SpriteGenerator.cellSize);
    }
    SpriteGenerator.redraw = redraw;
    function drawLines(size) {
        SpriteGenerator.ctx.beginPath();
        var ws = SpriteGenerator.canvas.width / size;
        var hs = SpriteGenerator.canvas.height / size;
        for (var i = 0; i <= SpriteGenerator.canvas.width; i += ws) {
            SpriteGenerator.ctx.moveTo(i, 0);
            SpriteGenerator.ctx.lineTo(i, SpriteGenerator.canvas.height);
        }
        for (var i = 0; i <= SpriteGenerator.canvas.height; i += hs) {
            SpriteGenerator.ctx.moveTo(0, i);
            SpriteGenerator.ctx.lineTo(SpriteGenerator.canvas.width, i);
        }
        SpriteGenerator.ctx.stroke();
    }
    SpriteGenerator.drawLines = drawLines;
    function drawHighlight() {
        redraw();
        var fex = Math.ceil(SpriteGenerator.ex / SpriteGenerator.cellSize) * SpriteGenerator.cellSize;
        var fey = Math.ceil(SpriteGenerator.ey / SpriteGenerator.cellSize) * SpriteGenerator.cellSize;
        var fbx = Math.floor(SpriteGenerator.bx / SpriteGenerator.cellSize) * SpriteGenerator.cellSize;
        var fby = Math.floor(SpriteGenerator.by / SpriteGenerator.cellSize) * SpriteGenerator.cellSize;
        var x = fex < fbx ? fex : fbx;
        var y = fey < fby ? fey : fby;
        var w = Math.abs(fex - fbx);
        var h = Math.abs(fey - fby);
        SpriteGenerator.ctx.save();
        SpriteGenerator.ctx.fillStyle = "rgba(0,0,225,0.5)";
        SpriteGenerator.ctx.fillRect(x, y, w, h);
        SpriteGenerator.ctx.restore();
        return { x: x, y: y, w: w, h: h };
    }
    SpriteGenerator.drawHighlight = drawHighlight;
})(SpriteGenerator || (SpriteGenerator = {}));
var SpriteGenerator;
(function (SpriteGenerator) {
    SpriteGenerator.imageLoader = document.getElementById("imageLoader");
    SpriteGenerator.canvas = document.getElementById("imageCanvas");
    SpriteGenerator.ctx = SpriteGenerator.canvas.getContext("2d");
    SpriteGenerator.cellSize = 32;
    SpriteGenerator.pointer = false;
    SpriteGenerator.manifest = {};
})(SpriteGenerator || (SpriteGenerator = {}));
var SpriteGenerator;
(function (SpriteGenerator) {
    function trimFileName(file) {
        var fname = file.split(".")[0];
        var name = fname
            .split("-")
            .map(function (e) {
            return e.charAt(0).toUpperCase() + e.slice(1);
        })
            .join("");
        return name;
    }
    SpriteGenerator.trimFileName = trimFileName;
    function download(filename, text) {
        var element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    SpriteGenerator.download = download;
})(SpriteGenerator || (SpriteGenerator = {}));
/// <reference path="canvas.ts" />
/// <reference path="globals.ts" />
/// <reference path="types.ts" />
/// <reference path="utils.ts" />
var SpriteGenerator;
(function (SpriteGenerator) {
    SpriteGenerator.imageLoader.addEventListener("change", SpriteGenerator.handleImage, false);
    SpriteGenerator.canvas.addEventListener("pointerdown", function (event) {
        SpriteGenerator.pointer = true;
        SpriteGenerator.bx = event.offsetX;
        SpriteGenerator.by = event.offsetY;
    });
    SpriteGenerator.canvas.addEventListener("pointermove", function (event) {
        if (SpriteGenerator.pointer) {
            SpriteGenerator.ex = event.offsetX;
            SpriteGenerator.ey = event.offsetY;
            SpriteGenerator.drawHighlight();
        }
    });
    SpriteGenerator.canvas.addEventListener("pointerup", function (event) {
        SpriteGenerator.pointer = false;
        SpriteGenerator.ex = event.offsetX;
        SpriteGenerator.ey = event.offsetY;
        var position = SpriteGenerator.drawHighlight();
        var name = SpriteGenerator.trimFileName(prompt("Enter Sprite Name"));
        if (name) {
            SpriteGenerator.manifest[SpriteGenerator.resource][name] = position;
        }
        SpriteGenerator.redraw();
    });
    document.getElementById("generate").addEventListener("click", function () {
        SpriteGenerator.download((prompt("Enter a filename.") || "manifest") + ".json", JSON.stringify(SpriteGenerator.manifest, null, 4));
    });
    document.getElementById("sync").addEventListener("click", function () {
        var keys = Object.keys(SpriteGenerator.manifest);
        keys.forEach(function (key) {
            var res = SpriteGenerator.manifest[key];
            var sprites = Object.keys(res);
            sprites.forEach(function (sp) {
                keys.forEach(function (k) { return (SpriteGenerator.manifest[k][sp] = JSON.parse(JSON.stringify(res[sp]))); });
            });
        });
        console.log(SpriteGenerator.manifest);
    });
    document.getElementById("preview").addEventListener("click", function () {
        alert(JSON.stringify(SpriteGenerator.manifest, null, 4));
    });
})(SpriteGenerator || (SpriteGenerator = {}));
