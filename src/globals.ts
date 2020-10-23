namespace SpriteGenerator.Globals {
    export const imageLoader = document.getElementById("imageLoader");
    export const canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
    export const ctx = canvas.getContext("2d");
    export let files: File[] = []; 
    export let img: HTMLImageElement;
    export let cellSizeX: number = 64;
    export let cellSizeY: number = 64;
    export let pointer = false;
    export let bx: number;
    export let by: number;
    export let ex: number;
    export let ey: number;
    export let manifest: Types.Manifest = {};
    export let resource: string;
}