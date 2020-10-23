/// <reference path="storage.ts" />

namespace SpriteGenerator.Dom {

    const templates = document.getElementById("templates");
    const filesview = document.getElementById("files-view");
    const minimizeButton = `<h4 id="minimize-files-view" onclick="SpriteGenerator.Dom.toggleFileView()"><span class="badge badge-primary"><i class="fas fa-compress-arrows-alt"></i></span></h4>`;
    let filesviewVisible = true;
    let previousHtml = minimizeButton;

    export function fillTemplates() {
        Storage.load();

        const lis = [];
        Object.keys(Storage.templates).forEach(k => {
            lis.push(createTemplate(k));
        });

        templates.innerHTML = lis.join("\n");
    }

    export function fillFiles(files: File[]) {
        const names = files.map(f => f.name);
        const contents = files.map((f) => Utils.chunk(f.name.split(""), 20).map(s => s.join("")).join(" "));
        const divs = names.map((n, i) => createFileCard(n, contents[i]));

        filesviewVisible = true;
        filesview.innerHTML = minimizeButton + divs.join("\n");
    }

    export function clearFiles() {
        filesview.innerHTML = "";
    }

    export function toggleFileView() {
        if (filesviewVisible) {
            previousHtml = filesview.innerHTML;
            filesview.innerHTML = minimizeButton;
        } else {
            filesview.innerHTML = previousHtml;
        }

        filesviewVisible = !filesviewVisible;
    }

    export function displayTemplateContent(name: string) {
        Alerts.json("Template : " + name, Storage.templates[name]).alert();
    }

    export async function deleteTemplateContent(name: string) {
        const res = await Alerts.confirmModal("Template : " + name, "Are you sure you want to delete this template?");

        if (res) Storage.deleteTemplate(name);

        fillTemplates();
    }

    export async function applyTemplateContent(name: string) {
        let res = false;
        if (Globals.files.length > 1) {
            res = await Alerts.confirmModal("Template : " + name, "Would you like to apply the template to all the files?");
        }

        if (res) {
            Globals.files.forEach(f => {
                const r = Utils.trimFileName(f.name);
                Utils.assignAll(Storage.templates[name]).to(Globals.manifest[r]);
            });
        } else {
            Utils.assignAll(Storage.templates[name]).to(Globals.manifest[Globals.resource]);
        }
    }

    function createTemplate(name: string) {
        const checkTemplateFunction = `onclick="SpriteGenerator.Dom.displayTemplateContent('${name}')"`;
        const checkTemplateContent = `<button class="btn btn-primary" ${checkTemplateFunction}> <i class="fas fa-book-open"></i> </button>`;
        const applyTemplateFunction = `onclick="SpriteGenerator.Dom.applyTemplateContent('${name}')"`;
        const applyTemplateContent = `<button class="btn btn-primary" ${applyTemplateFunction}> <i class="fas fa-magic"></i> </button>`;
        const deleteTemplateFunction = `onclick="SpriteGenerator.Dom.deleteTemplateContent('${name}')"`;
        const deleteTemplateContent = `<button class="btn btn-danger" ${deleteTemplateFunction}> <i class="fas fa-trash"></i> </button>`;
        
        return `<li class="list-group-item d-flex justify-content-between align-items-center"> <span> ${name} </span> <span> ${checkTemplateContent} ${applyTemplateContent} ${deleteTemplateContent} </span></li>`;
    }

    function createFileCard(name: string, content: string) {
        return `<div class="card file-card" onclick="SpriteGenerator.Canvas.readImage('${name}')">${content}</div>`;
    }
}