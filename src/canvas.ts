namespace SpriteGenerator.Canvas {

    export function handleImage(e: any) {
        if (e.target.files.length === 1) {
          return readImage(e.target.files[0]);
        } 

        Globals.files = [...e.target.files as FileList];

        Globals.files.forEach(f => {
			  const r = Utils.trimFileName(f.name);
          	if (!Globals.manifest[r]) Globals.manifest[r] = {};
        });
        
        Dom.fillFiles(Globals.files);

        Globals.ctx.clearRect(0, 0, Globals.canvas.width, Globals.canvas.height);
        Globals.canvas.width = 0;
        Globals.canvas.height = 0;
      }
    
      export function readImage(nameOrFile: File | string) {
        let file: File;

        if (typeof nameOrFile === "string") {
          file = Globals.files.find(f => f.name === nameOrFile);
        } else {
          file = nameOrFile;
        }

        let reader = new FileReader();

        reader.onload = function(event) {
		      Globals.img = new Image();
		  
          Globals.img.onload = function() {
			        Globals.resource = Utils.trimFileName(file.name);
              if (!Globals.manifest[Globals.resource]) Globals.manifest[Globals.resource] = {};
              redraw();
          };
          Globals.img.src = event.target.result as string;
        };

        reader.readAsDataURL(file);
      }

      export function redraw() {
        Globals.canvas.width = Globals.img.width;
        Globals.canvas.height = Globals.img.height;
        Globals.ctx.drawImage(Globals.img, 0, 0);
        drawLines(Globals.cellSizeX, Globals.cellSizeY);
      }
    
      export function drawLines(sizeX: number, sizeY: number) {
        Globals.ctx.beginPath();
    
        for (let i = 0; i <= Globals.canvas.width; i += sizeX) {
		  Globals.ctx.moveTo(i, 0);
          Globals.ctx.lineTo(i, Globals.canvas.height);
        }
    
        for (let i = 0; i <= Globals.canvas.height; i += sizeY) {
		  Globals.ctx.moveTo(0, i);
          Globals.ctx.lineTo(Globals.canvas.width, i);
        }
    
        Globals.ctx.stroke();
      }
    
      export function drawHighlight() {
        redraw();
    
        const fex = Math.ceil(Globals.ex / Globals.cellSizeX) * Globals.cellSizeX;
        const fey = Math.ceil(Globals.ey / Globals.cellSizeY) * Globals.cellSizeY;
        const fbx = Math.floor(Globals.bx / Globals.cellSizeX) * Globals.cellSizeX;
        const fby = Math.floor(Globals.by / Globals.cellSizeY) * Globals.cellSizeY;
    
        const x = fex < fbx ? fex : fbx;
        const y = fey < fby ? fey : fby;
        const w = Math.abs(fex - fbx);
        const h = Math.abs(fey - fby);
    
        Globals.ctx.save();
        Globals.ctx.fillStyle = "rgba(0,0,225,0.5)";
        Globals.ctx.fillRect(x, y, w, h);
        Globals.ctx.restore();
    
        return { x, y, w, h };
      }
}