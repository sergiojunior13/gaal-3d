import type { Point2D } from "../../objects/points/point2d";
import { Vector2D } from "../../objects/vectors/vector2d";
import { Matrix } from "../matrix";

export type Coords = Vector2D | Point2D | { x: number; y: number };

export class LAlgebra {
    static sum(vec1: Coords, vec2: Coords) {
        return {
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y,
        };
    }

    static subtract(vec1: Coords, vec2: Coords) {
        const negative_vector_2 = this.scale(vec2, -1);

        return this.sum(vec1, negative_vector_2);
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

    static multiply(A: Matrix, B: Matrix): Matrix | null {
        if (A.n_rows === 0 || B.n_rows === 0) return null;

        // Verifica se pode multiplicar
        if (A.n_cols !== B.n_rows) {
            console.error(`Erro: não é possível multiplicar essas matrizes.`);
            return null;
        }

        const C: number[][] = [];

        for (let i = 0; i < A.n_rows; i++) {
            C[i] = [];

            for (let j = 0; j < B.n_cols; j++) {
                let sum = 0;

                for (let k = 0; k < A.n_cols; k++) {
                    sum += A.values[i][k] * B.values[k][j];
                }

                C[i][j] = sum;
            }
        }

        return new Matrix(C);
    }
}
