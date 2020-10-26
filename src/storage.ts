namespace SpriteGenerator.Storage {
    export let templates: {[key: string]: Types.Sprites} = {};

    export function load() {
        templates = localStorage.getItem("templates") ? JSON.parse(localStorage.getItem("templates")): {} ;
    }

    export async function upload(key: string, str: string) {
        let template: any;
        try {
            template = JSON.parse(str);
        }
        catch (e) {
            return Alerts.alertModal("ERROR", "The supplied template is not valid");
        }

        if (!Types.isSprites(template)) return Alerts.alertModal("ERROR", "The supplied template is not valid");
        templates[key] = template;

        sync();
    }

    export function sync() {
        localStorage.setItem("templates", JSON.stringify(templates));
    }

    export function clear() {
        templates = {};
        sync();
    }

    export function deleteTemplate(name: string) {
        delete templates[name];
        sync();
    }
}