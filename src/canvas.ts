namespace SpriteGenerator {

    export function handleImage(e: any) {
        var reader = new FileReader();
        reader.onload = function(event) {
          img = new Image();
          img.onload = function() {
            resource = trimFileName(e.target.files[0].name);
            if (!manifest[resource]) manifest[resource] = [];
            redraw();
          };
          img.src = event.target.result as string;
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    
      export function redraw() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        drawLines(cellSize);
      }
    
      export function drawLines(size: number) {
        ctx.beginPath();
    
        const ws = canvas.width / size;
        const hs = canvas.height / size;
    
        for (let i = 0; i <= canvas.width; i += ws) {
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
        }
    
        for (let i = 0; i <= canvas.height; i += hs) {
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
        }
    
        ctx.stroke();
      }
    
      export function drawHighlight() {
        redraw();
    
        const fex = Math.ceil(ex / cellSize) * cellSize;
        const fey = Math.ceil(ey / cellSize) * cellSize;
        const fbx = Math.floor(bx / cellSize) * cellSize;
        const fby = Math.floor(by / cellSize) * cellSize;
    
        const x = fex < fbx ? fex : fbx;
        const y = fey < fby ? fey : fby;
        const w = Math.abs(fex - fbx);
        const h = Math.abs(fey - fby);
    
        ctx.save();
        ctx.fillStyle = "rgba(0,0,225,0.5)";
        ctx.fillRect(x, y, w, h);
        ctx.restore();
    
        return { x, y, w, h };
      }
}