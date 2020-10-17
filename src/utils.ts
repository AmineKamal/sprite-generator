namespace SpriteGenerator {
    export function trimFileName(file: string) {
        const fname = file.split(".")[0];
        const name = fname
          .split("-")
          .map(e => {
            return e.charAt(0).toUpperCase() + e.slice(1);
          })
          .join("");
    
        return name;
    }
    
    export function download(filename: string, text: string) {
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
}