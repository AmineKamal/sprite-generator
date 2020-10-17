
namespace SpriteGenerator {

    export interface Manifest {
        [key: string]: Sprites;
    }
      
    export interface Sprites {
        [name: string]: {
            x: number;
            y: number;
            w: number;
            h: number;
        }
    }
}