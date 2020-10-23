namespace SpriteGenerator.Utils {
  
    export function trimFileName(file: string) {
      const fname = file.split(".")[0];
      const name = fname.split(/-|\/| |\(|\)/).join("_").toUpperCase();
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

    export function sync() {
      const keys = Object.keys(Globals.manifest);

      keys.forEach((key) => {
        const res = Globals.manifest[key];
        const sprites = Object.keys(res);

        sprites.forEach(sp => {
          keys.forEach(k => (Globals.manifest[k][sp] = JSON.parse(JSON.stringify(res[sp]))));
        });
      });

      console.log(Globals.manifest);
    }

    export function useTemplate(key: string) {
      const template = Storage.templates[key];
      Object.keys(Globals.manifest).forEach(k => (Globals.manifest[k] = template));
    }

    export function chunk<T>(arr: T[], len: number): T[][] {
      const chunks: T[][] = [];

      let i = 0;
      let current: T[] = [];
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

    export function assignAll(from: any) {
      const f = {
        to: (to: any) => {
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
}