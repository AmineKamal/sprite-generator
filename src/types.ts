
namespace SpriteGenerator {

    export interface Manifest {
        [key: string]: Sprite[];
    }
      
    export interface Sprite {
        name: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }
}