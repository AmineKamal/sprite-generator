namespace SpriteGenerator.Alerts {
    const confirmButton = document.getElementById("confirm-button") as HTMLButtonElement;
    const confirmTitle = document.getElementById("confirm-title");
    const confirmBody = document.getElementById("confirm-body");
    const confirmClose = document.getElementById("confirm-close");
    const confirmConfirm = document.getElementById("confirm-confirm");

    export async function confirmModal(title: string, body: string) {
        confirmTitle.innerHTML = title;
        confirmBody.innerHTML = body;
        confirmButton.click();

        const promise = new Promise<boolean>((resolve) => {

            confirmClose.addEventListener("click",  function (e) {
                resolve(false);
                e.target.removeEventListener(e.type, arguments.callee as any);
            });

            confirmConfirm.addEventListener("click",  function (e) {
                resolve(true);
                e.target.removeEventListener(e.type, arguments.callee as any);
            });

        });

        return promise;
    }

    const alertButton = document.getElementById("alert-button") as HTMLButtonElement;
    const alertTitle = document.getElementById("alert-title");
    const alertBody = document.getElementById("alert-body");
    const alertClose = document.getElementById("alert-close");

    export async function alertModal(title: string, body: string) {
        alertTitle.innerHTML = title;
        alertBody.innerHTML = body;
        alertButton.click();

        const promise = new Promise<void>((resolve) => {
            alertClose.addEventListener("click",  function (e) {
                resolve();
                e.target.removeEventListener(e.type, arguments.callee as any);
            });
        });

        return promise;
    }

    const promptButton = document.getElementById("prompt-button") as HTMLButtonElement;
    const promptTitle = document.getElementById("prompt-title");
    const promptTextarea = document.getElementById("prompt-textarea") as HTMLTextAreaElement;
    const promptClose = document.getElementById("prompt-close");

    export async function promptModal(title: string) {
        promptTitle.innerHTML = title;
        promptButton.click();

        const promise = new Promise<string>((resolve) => {
            promptClose.addEventListener("click",  function (e) {
                const content = promptTextarea.value;
                promptTextarea.value = "";
                resolve(content);
                e.target.removeEventListener(e.type, arguments.callee as any);
            });
        });

        return promise;
    }

    export function json<T>(title: string, data: T) {
        const content = "<pre>" + JSON.stringify(data, null, 4) + "</pre>";

        const modals = {
            alert: async () => alertModal(title, content),
            confirm: async () => confirmModal(title, content)
        };

        return modals;
    }
}