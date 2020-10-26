
namespace SpriteGenerator.Types {

    export interface Manifest {
        [key: string]: Sprites;
    }
      
    export interface Sprites {
        [name: string]: SpriteLocation;
    }

    export interface SpriteLocation {
        x: number;
        y: number;
        w: number;
        h: number;
    }

    export function isManifest(obj: any): obj is Manifest {
        const keys = Object.keys(obj);

        if (keys.some(k => typeof k !== "string")) return false;

        if (keys.some(k => !isSprites(obj[k]))) return false;

        return true;
    }

    export function isSprites(obj: any): obj is Sprites {
        const keys = Object.keys(obj);

        if (keys.some(k => typeof k !== "string")) return false;

        if (keys.some(k => !isSpriteLocation(obj[k]))) return false;

        return true;
    }

    export function isSpriteLocation(obj: any): obj is SpriteLocation {
        return (
            typeof obj === "object" && 
            typeof obj.x === "number" && 
            typeof obj.y === "number" && 
            typeof obj.w === "number" && 
            typeof obj.h === "number"
        );
    }
    
}