var SpriteGenerator;
(function (SpriteGenerator) {
    var Canvas;
    (function (Canvas) {
        function handleImage(e) {
            if (e.target.files.length === 1) {
                return readImage(e.target.files[0]);
            }
            SpriteGenerator.Globals.files = [...e.target.files];
            SpriteGenerator.Globals.files.forEach(f => {
                const r = SpriteGenerator.Utils.trimFileName(f.name);
                if (!SpriteGenerator.Globals.manifest[r])
                    SpriteGenerator.Globals.manifest[r] = {};
            });
            SpriteGenerator.Dom.fillFiles(SpriteGenerator.Globals.files);
            SpriteGenerator.Globals.ctx.clearRect(0, 0, SpriteGenerator.Globals.canvas.width, SpriteGenerator.Globals.canvas.height);
            SpriteGenerator.Globals.canvas.width = 0;
            SpriteGenerator.Globals.canvas.height = 0;
        }
        Canvas.handleImage = handleImage;
        function readImage(nameOrFile) {
            let file;
            if (typeof nameOrFile === "string") {
                file = SpriteGenerator.Globals.files.find(f => f.name === nameOrFile);
            }
            else {
                file = nameOrFile;
            }
            let reader = new FileReader();
            reader.onload = function (event) {
                SpriteGenerator.Globals.img = new Image();
                SpriteGenerator.Globals.img.onload = function () {
                    SpriteGenerator.Globals.resource = SpriteGenerator.Utils.trimFileName(file.name);
                    if (!SpriteGenerator.Globals.manifest[SpriteGenerator.Globals.resource])
                        SpriteGenerator.Globals.manifest[SpriteGenerator.Globals.resource] = {};
                    redraw();
                };
                SpriteGenerator.Globals.img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
        Canvas.readImage = readImage;
        function redraw() {
            SpriteGenerator.Globals.canvas.width = SpriteGenerator.Globals.img.width;
            SpriteGenerator.Globals.canvas.height = SpriteGenerator.Globals.img.height;
            SpriteGenerator.Globals.ctx.drawImage(SpriteGenerator.Globals.img, 0, 0);
            drawLines(SpriteGenerator.Globals.cellSizeX, SpriteGenerator.Globals.cellSizeY);
        }
        Canvas.redraw = redraw;
        function drawLines(sizeX, sizeY) {
            SpriteGenerator.Globals.ctx.beginPath();
            for (let i = 0; i <= SpriteGenerator.Globals.canvas.width; i += sizeX) {
                SpriteGenerator.Globals.ctx.moveTo(i, 0);
                SpriteGenerator.Globals.ctx.lineTo(i, SpriteGenerator.Globals.canvas.height);
            }
            for (let i = 0; i <= SpriteGenerator.Globals.canvas.height; i += sizeY) {
                SpriteGenerator.Globals.ctx.moveTo(0, i);
                SpriteGenerator.Globals.ctx.lineTo(SpriteGenerator.Globals.canvas.width, i);
            }
            SpriteGenerator.Globals.ctx.stroke();
        }
        Canvas.drawLines = drawLines;
        function drawHighlight() {
            redraw();
            const fex = Math.ceil(SpriteGenerator.Globals.ex / SpriteGenerator.Globals.cellSizeX) * SpriteGenerator.Globals.cellSizeX;
            const fey = Math.ceil(SpriteGenerator.Globals.ey / SpriteGenerator.Globals.cellSizeY) * SpriteGenerator.Globals.cellSizeY;
            const fbx = Math.floor(SpriteGenerator.Globals.bx / SpriteGenerator.Globals.cellSizeX) * SpriteGenerator.Globals.cellSizeX;
            const fby = Math.floor(SpriteGenerator.Globals.by / SpriteGenerator.Globals.cellSizeY) * SpriteGenerator.Globals.cellSizeY;
            const x = fex < fbx ? fex : fbx;
            const y = fey < fby ? fey : fby;
            const w = Math.abs(fex - fbx);
            const h = Math.abs(fey - fby);
            SpriteGenerator.Globals.ctx.save();
            SpriteGenerator.Globals.ctx.fillStyle = "rgba(0,0,225,0.5)";
            SpriteGenerator.Globals.ctx.fillRect(x, y, w, h);
            SpriteGenerator.Globals.ctx.restore();
            return { x, y, w, h };
        }
        Canvas.drawHighlight = drawHighlight;
    })(Canvas = SpriteGenerator.Canvas || (SpriteGenerator.Canvas = {}));
})(SpriteGenerator || (SpriteGenerator = {}));
var SpriteGenerator;
(function (SpriteGenerator) {
    var Globals;
    (function (Globals) {
        Globals.imageLoader = document.getElementById("imageLoader");
        Globals.canvas = document.getElementById("imageCanvas");
        Globals.ctx = Globals.canvas.getContext("2d");
        Globals.files = [];
        Globals.cellSizeX = 64;
        Globals.cellSizeY = 64;
        Globals.pointer = false;
        Globals.manifest = {};
    })(Globals = SpriteGenerator.Globals || (SpriteGenerator.Globals = {}));
})(SpriteGenerator || (SpriteGenerator = {}));
var SpriteGenerator;
(function (SpriteGenerator) {
    var Types;
    (function (Types) {
        function isManifest(obj) {
            const keys = Object.keys(obj);
            if (keys.some(k => typeof k !== "string"))
                return false;
            if (keys.some(k => !isSprites(obj[k])))
                return false;
            return true;
        }
        Types.isManifest = isManifest;
        function isSprites(obj) {
            const keys = Object.keys(obj);
            if (keys.some(k => typeof k !== "string"))
                return false;
            if (keys.some(k => !isSpriteLocation(obj[k])))
                return false;
            return true;
        }
        Types.isSprites = isSprites;
        function isSpriteLocation(obj) {
            return (typeof obj === "object" &&
                typeof obj.x === "number" &&
                typeof obj.y === "number" &&
                typeof obj.w === "number" &&
                typeof obj.h === "number");
        }
        Types.isSpriteLocation = isSpriteLocation;
    })(Types = SpriteGenerator.Types || (SpriteGenerator.Types = {}));
})(SpriteGenerator || (SpriteGenerator = {}));
var SpriteGenerator;
(function (SpriteGenerator) {
    var Utils;
    (function (Utils) {
        function trimFileName(file) {
            const fname = file.split(".")[0];
            const name = fname.split(/-|\/| |\(|\)/).join("_").toUpperCase();
            return name;
        }
        Utils.trimFileName = trimFileName;
        function download(filename, text) {
            const element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
            element.setAttribute("download", filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        Utils.download = download;
        function sync() {
            const keys = Object.keys(SpriteGenerator.Globals.manifest);
            keys.forEach((key) => {
                const res = SpriteGenerator.Globals.manifest[key];
                const sprites = Object.keys(res);
                sprites.forEach(sp => {
                    keys.forEach(k => (SpriteGenerator.Globals.manifest[k][sp] = JSON.parse(JSON.stringify(res[sp]))));
                });
            });
            console.log(SpriteGenerator.Globals.manifest);
        }
        Utils.sync = sync;
        function useTemplate(key) {
            const template = SpriteGenerator.Storage.templates[key];
            Object.keys(SpriteGenerator.Globals.manifest).forEach(k => (SpriteGenerator.Globals.manifest[k] = template));
        }
        Utils.useTemplate = useTemplate;
        function chunk(arr, len) {
            const chunks = [];
            let i = 0;
            let current = [];
            arr.forEach(e => {
                current.push(e);
                if (++i >= len) {
                    chunks.push([...current]);
                    current = [];
                    i = 0;
                }
            });
            chunks.push(current);
            return chunks;
        }
        Utils.chunk = chunk;
        function assignAll(from) {
            const f = {
                to: (to) => {
                    if (typeof to !== "object") {
                        to = {};
                    }
                    Object.keys(from).forEach(k => {
                        to[k] = from[k];
                    });
                }
            };
            return f;
        }
        Utils.assignAll = assignAll;
    })(Utils = SpriteGenerator.Utils || (SpriteGenerator.Utils = {}));
})(SpriteGenerator || (SpriteGenerator = {}));
var SpriteGenerator;
(function (SpriteGenerator) {
    var Alerts;
    (function (Alerts) {
        const confirmButton = document.getElementById("confirm-button");
        const confirmTitle = document.getElementById("confirm-title");
        const confirmBody = document.getElementById("confirm-body");
        const confirmClose = document.getElementById("confirm-close");
        const confirmConfirm = document.getElementById("confirm-confirm");
        async function confirmModal(title, body) {
            confirmTitle.innerHTML = title;
            confirmBody.innerHTML = body;
            confirmButton.click();
            const promise = new Promise((resolve) => {
                confirmClose.addEventListener("click", function (e) {
                    resolve(false);
                    e.target.removeEventListener(e.type, arguments.callee);
                });
                confirmConfirm.addEventListener("click", function (e) {
                    resolve(true);
                    e.target.removeEventListener(e.type, arguments.callee);
                });
            });
            return promise;
        }
        Alerts.confirmModal = confirmModal;
        const alertButton = document.getElementById("alert-button");
        const alertTitle = document.getElementById("alert-title");
        const alertBody = document.getElementById("alert-body");
        const alertClose = document.getElementById("alert-close");
        async function alertModal(title, body) {
            alertTitle.innerHTML = title;
            alertBody.innerHTML = body;
            alertButton.click();
            const promise = new Promise((resolve) => {
                alertClose.addEventListener("click", function (e) {
                    resolve();
                    e.target.removeEventListener(e.type, arguments.callee);
                });
            });
            return promise;
        }
        Alerts.alertModal = alertModal;
        const promptButton = document.getElementById("prompt-button");
        const promptTitle = document.getElementById("prompt-title");
        const promptTextarea = document.getElementById("prompt-textarea");
        const promptClose = document.getElementById("prompt-close");
        async function promptModal(title) {
            promptTitle.innerHTML = title;
            promptButton.click();
            const promise = new Promise((resolve) => {
                promptClose.addEventListener("click", function (e) {
                    const content = promptTextarea.value;
                    promptTextarea.value = "";
                    resolve(content);
                    e.target.removeEventListener(e.type, arguments.callee);
                });
            });
            return promise;
        }
        Alerts.promptModal = promptModal;
        function json(title, data) {
            const content = "<pre>" + JSON.stringify(data, null, 4) + "</pre>";
            const modals = {
                alert: async () => alertModal(title, content),
                confirm: async () => confirmModal(title, content)
            };
            return modals;
        }
        Alerts.json = json;
    })(Alerts = SpriteGenerator.Alerts || (SpriteGenerator.Alerts = {}));
})(SpriteGenerator || (SpriteGenerator = {}));
var SpriteGenerator;
(function (SpriteGenerator) {
    var Storage;
    (function (Storage) {
        Storage.templates = {};
        function load() {
            Storage.templates = localStorage.getItem("templates") ? JSON.parse(localStorage.getItem("templates")) : {};
        }
        Storage.load = load;
        async function upload(key, str) {
            let template;
            try {
                template = JSON.parse(str);
            }
            catch (e) {
                return SpriteGenerator.Alerts.alertModal("ERROR", "The supplied template is not valid");
            }
            if (!SpriteGenerator.Types.isSprites(template))
                return SpriteGenerator.Alerts.alertModal("ERROR", "The supplied template is not valid");
            Storage.templates[key] = template;
            sync();
        }
        Storage.upload = upload;
        function sync() {
            localStorage.setItem("templates", JSON.stringify(Storage.templates));
        }
        Storage.sync = sync;
        function clear() {
            Storage.templates = {};
            sync();
        }
        Storage.clear = clear;
        function deleteTemplate(name) {
            delete Storage.templates[name];
            sync();
        }
        Storage.deleteTemplate = deleteTemplate;
    })(Storage = SpriteGenerator.Storage || (SpriteGenerator.Storage = {}));
})(SpriteGenerator || (SpriteGenerator = {}));
/// <reference path="storage.ts" />
var SpriteGenerator;
(function (SpriteGenerator) {
    var Dom;
    (function (Dom) {
        const templates = document.getElementById("templates");
        const filesview = document.getElementById("files-view");
        const minimizeButton = `<h4 id="minimize-files-view" onclick="SpriteGenerator.Dom.toggleFileView()"><span class="badge badge-primary"><i class="fas fa-compress-arrows-alt"></i></span></h4>`;
        let filesviewVisible = true;
        let previousHtml = minimizeButton;
        function fillTemplates() {
            SpriteGenerator.Storage.load();
            const lis = [];
            Object.keys(SpriteGenerator.Storage.templates).forEach(k => {
                lis.push(createTemplate(k));
            });
            templates.innerHTML = lis.join("\n");
        }
        Dom.fillTemplates = fillTemplates;
        function fillFiles(files) {
            const names = files.map(f => f.name);
            const contents = files.map((f) => SpriteGenerator.Utils.chunk(f.name.split(""), 20).map(s => s.join("")).join(" "));
            const divs = names.map((n, i) => createFileCard(n, contents[i]));
            filesviewVisible = true;
            filesview.innerHTML = minimizeButton + divs.join("\n");
        }
        Dom.fillFiles = fillFiles;
        function clearFiles() {
            filesview.innerHTML = "";
        }
        Dom.clearFiles = clearFiles;
        function toggleFileView() {
            if (filesviewVisible) {
                previousHtml = filesview.innerHTML;
                filesview.innerHTML = minimizeButton;
            }
            else {
                filesview.innerHTML = previousHtml;
            }
            filesviewVisible = !filesviewVisible;
        }
        Dom.toggleFileView = toggleFileView;
        function displayTemplateContent(name) {
            SpriteGenerator.Alerts.json("Template : " + name, SpriteGenerator.Storage.templates[name]).alert();
        }
        Dom.displayTemplateContent = displayTemplateContent;
        async function deleteTemplateContent(name) {
            const res = await SpriteGenerator.Alerts.confirmModal("Template : " + name, "Are you sure you want to delete this template?");
            if (res)
                SpriteGenerator.Storage.deleteTemplate(name);
            fillTemplates();
        }
        Dom.deleteTemplateContent = deleteTemplateContent;
        async function applyTemplateContent(name) {
            let res = false;
            if (SpriteGenerator.Globals.files.length > 1) {
                res = await SpriteGenerator.Alerts.confirmModal("Template : " + name, "Would you like to apply the template to all the files?");
            }
            if (res) {
                SpriteGenerator.Globals.files.forEach(f => {
                    const r = SpriteGenerator.Utils.trimFileName(f.name);
                    SpriteGenerator.Utils.assignAll(SpriteGenerator.Storage.templates[name]).to(SpriteGenerator.Globals.manifest[r]);
                });
            }
            else {
                SpriteGenerator.Utils.assignAll(SpriteGenerator.Storage.templates[name]).to(SpriteGenerator.Globals.manifest[SpriteGenerator.Globals.resource]);
            }
        }
        Dom.applyTemplateContent = applyTemplateContent;
        function createTemplate(name) {
            const checkTemplateFunction = `onclick="SpriteGenerator.Dom.displayTemplateContent('${name}')"`;
            const checkTemplateContent = `<button class="btn btn-primary" ${checkTemplateFunction}> <i class="fas fa-book-open"></i> </button>`;
            const applyTemplateFunction = `onclick="SpriteGenerator.Dom.applyTemplateContent('${name}')"`;
            const applyTemplateContent = `<button class="btn btn-primary" ${applyTemplateFunction}> <i class="fas fa-magic"></i> </button>`;
            const deleteTemplateFunction = `onclick="SpriteGenerator.Dom.deleteTemplateContent('${name}')"`;
            const deleteTemplateContent = `<button class="btn btn-danger" ${deleteTemplateFunction}> <i class="fas fa-trash"></i> </button>`;
            return `<li class="list-group-item d-flex justify-content-between align-items-center"> <span> ${name} </span> <span> ${checkTemplateContent} ${applyTemplateContent} ${deleteTemplateContent} </span></li>`;
        }
        function createFileCard(name, content) {
            return `<div class="card file-card" onclick="SpriteGenerator.Canvas.readImage('${name}')">${content}</div>`;
        }
    })(Dom = SpriteGenerator.Dom || (SpriteGenerator.Dom = {}));
})(SpriteGenerator || (SpriteGenerator = {}));
/// <reference path="canvas.ts" />
/// <reference path="globals.ts" />
/// <reference path="types.ts" />
/// <reference path="utils.ts" />
/// <reference path="alerts.ts" />
/// <reference path="storage.ts" />
/// <reference path="dom.ts" />
var SpriteGenerator;
(function (SpriteGenerator) {
    SpriteGenerator.Globals.imageLoader.addEventListener("change", SpriteGenerator.Canvas.handleImage, false);
    SpriteGenerator.Globals.canvas.addEventListener("pointerdown", event => {
        SpriteGenerator.Globals.pointer = true;
        SpriteGenerator.Globals.bx = event.offsetX;
        SpriteGenerator.Globals.by = event.offsetY;
    });
    SpriteGenerator.Globals.canvas.addEventListener("pointermove", event => {
        if (SpriteGenerator.Globals.pointer) {
            SpriteGenerator.Globals.ex = event.offsetX;
            SpriteGenerator.Globals.ey = event.offsetY;
            SpriteGenerator.Canvas.drawHighlight();
        }
    });
    SpriteGenerator.Globals.canvas.addEventListener("pointerup", event => {
        SpriteGenerator.Globals.pointer = false;
        SpriteGenerator.Globals.ex = event.offsetX;
        SpriteGenerator.Globals.ey = event.offsetY;
        const position = SpriteGenerator.Canvas.drawHighlight();
        const name = SpriteGenerator.Utils.trimFileName(prompt("Enter Sprite Name"));
        if (name) {
            SpriteGenerator.Globals.manifest[SpriteGenerator.Globals.resource][name] = position;
        }
        SpriteGenerator.Canvas.redraw();
    });
    document.getElementById("generate").addEventListener("click", () => {
        SpriteGenerator.Utils.download((prompt("Enter a filename.") || "manifest") + ".json", JSON.stringify(SpriteGenerator.Globals.manifest, null, 4));
    });
    document.getElementById("sync").addEventListener("click", () => {
        SpriteGenerator.Utils.sync();
    });
    document.getElementById("preview").addEventListener("click", async () => {
        SpriteGenerator.Alerts.json("Preview", SpriteGenerator.Globals.manifest).alert();
    });
    document.getElementById("cell-x").addEventListener("change", () => {
        const val = document.getElementById("cell-x").value;
        SpriteGenerator.Globals.cellSizeX = parseInt(val);
        if (SpriteGenerator.Globals.img)
            SpriteGenerator.Canvas.redraw();
    });
    document.getElementById("cell-y").addEventListener("change", () => {
        const val = document.getElementById("cell-y").value;
        SpriteGenerator.Globals.cellSizeY = parseInt(val);
        if (SpriteGenerator.Globals.img)
            SpriteGenerator.Canvas.redraw();
    });
    document.getElementById("new-template").addEventListener("click", async () => {
        const content = await SpriteGenerator.Alerts.promptModal("Enter Template Here");
        if (!content)
            return;
        const name = prompt("Enter Template Name");
        if (!name)
            return;
        await SpriteGenerator.Storage.upload(name, content);
        SpriteGenerator.Dom.fillTemplates();
    });
    document.getElementById("save").addEventListener("click", async () => {
        const content = JSON.stringify(SpriteGenerator.Globals.manifest[SpriteGenerator.Globals.resource], null, 4);
        const response = await SpriteGenerator.Alerts.confirmModal("Would you like to save this template?", content);
        if (!response)
            return;
        const name = prompt("Enter Template Name");
        if (!name)
            return;
        await SpriteGenerator.Storage.upload(name, content);
        SpriteGenerator.Dom.fillTemplates();
    });
    (document.getElementById("manifestLoader")).addEventListener("change", async (e) => {
        const file = e.target.files[0];
        const fr = new FileReader();
        fr.onload = async (ev) => {
            let manifest;
            try {
                manifest = JSON.parse(ev.target.result);
            }
            catch (e) {
                return SpriteGenerator.Alerts.alertModal("ERROR", "The supplied file is not valid");
            }
            if (!SpriteGenerator.Types.isManifest(manifest))
                return SpriteGenerator.Alerts.alertModal("ERROR", "The supplied template is not valid");
            SpriteGenerator.Globals.manifest = manifest;
        };
        fr.readAsText(file);
    });
    SpriteGenerator.Dom.fillTemplates();
})(SpriteGenerator || (SpriteGenerator = {}));
