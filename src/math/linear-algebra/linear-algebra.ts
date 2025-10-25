import type { Point2D } from "../../objects/points/point2d";
import { Vector2D } from "../../objects/vectors/vector2d";

type Coords = Vector2D | Point2D | { x: number; y: number };

export class LAlgebra {
    static sum(vec1: Coords, vec2: Coords) {
        return {
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y,
        };
    }

    static subtract(vec1: Coords, vec2: Coords) {
        const vecInverse = {
            x: -vec2.x,
            y: -vec2.y,
        };

        return this.sum(vec1, vecInverse);
    }

    static scale(vec: Coords, scalar: number) {
        return {
            x: vec.x * scalar,
            y: vec.y * scalar,
        };
    }

    static norm(vec: Coords) {
        return Math.sqrt(vec.x ** 2 + vec.y ** 2);
    }

    static multiply(A: number[][], B: number[][]): number[][] | null {
        const nRows1 = A.length;
        const nCols1 = A[0].length;

        const nRows2 = B.length;
        const nCols2 = B[0].length;

        if (nRows1 === 0 || nRows2 === 0) return null;

        // Verifica se pode multiplicar
        if (nCols1 !== nRows2) {
            console.error(`Erro: não é possível multiplicar essas matrizes.`);
            return null;
        }

        const C: number[][] = [];

        for (let i = 0; i < nRows1; i++) {
            C[i] = [];

            for (let j = 0; j < nCols2; j++) {
                let sum = 0;

                for (let k = 0; k < nCols1; k++) {
                    sum += A[i][k] * B[k][j];
                }

                C[i][j] = sum;
            }
        }

        return C;
    }
}
