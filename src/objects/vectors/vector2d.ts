import type { DrawProps } from "../../interfaces/object";
import { LAlgebra, type Coords } from "../../math/linear-algebra/linear-algebra";
import { Matrix } from "../../math/matrix";

export class Vector2D implements Object {
    x = 0;
    y = 0;
    start: Coords = { x: 0, y: 0 };
    end: Coords;

    color = "#0f0";

    triangleSize = 0.5;

    constructor({ p1: point1, p2: point2 }: { p1: Coords; p2?: Coords }, options?: { color?: string }) {
        if (point2) {
            this.x = point2.x - point1.x;
            this.y = point2.y - point1.y;

            this.start = point1;
            this.end = point2;
        } else {
            this.x = point1.x;
            this.y = point1.y;

            this.end = point1;
        }

        if (options) {
            if (options.color) this.color = options.color;
        }
    }

    draw({ ctx, zoom, unit }: DrawProps) {
        const scale = zoom * unit;

        // Encurtar a reta para que fique imediatamente antes do começo do triângulo da seta
        const shrink_factor = 1 - this.triangleSize / LAlgebra.norm({ x: this.x, y: this.y });

        ctx.beginPath();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.05 * scale;
        ctx.moveTo(this.start.x * scale, this.start.y * scale);
        ctx.lineTo((this.start.x + this.x * shrink_factor) * scale, (this.start.y + this.y * shrink_factor) * scale);
        ctx.stroke();

        // Desenhar o triângulo na ponto do vetor
        const points = this.getTriangleCoords();
        if (!points) return;

        let { p1, p2, p3 } = points;
        p1 = LAlgebra.scale(p1, scale);
        p2 = LAlgebra.scale(p2, scale);
        p3 = LAlgebra.scale(p3, scale);

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
    }

    getTriangleCoords() {
        let P = { x: this.end.x, y: this.end.y };

        const angle = Math.atan2(this.y, this.x);

        let P2 = {
            x: P.x - this.triangleSize,
            y: P.y + this.triangleSize / 2,
        };

        let P3 = {
            x: P.x - this.triangleSize,
            y: P.y - this.triangleSize / 2,
        };

        let PP2 = LAlgebra.subtract(P2, P);
        let PP3 = LAlgebra.subtract(P3, P);

        // Rotacionar os vetores/pontos pelo ângulo
        const rotation_matrix = new Matrix([
            [Math.cos(angle), -Math.sin(angle)],
            [Math.sin(angle), Math.cos(angle)],
        ]);

        const rotated_P2 = LAlgebra.multiply(rotation_matrix, new Matrix([[PP2.x], [PP2.y]]));
        const rotated_P3 = LAlgebra.multiply(rotation_matrix, new Matrix([[PP3.x], [PP3.y]]));

        if (!rotated_P2 || !rotated_P3) return null;

        PP2 = { x: rotated_P2.values[0][0], y: rotated_P2.values[1][0] };
        PP3 = { x: rotated_P3.values[0][0], y: rotated_P3.values[1][0] };

        // Somar os vetores/pontos com P novamente para obter as coordenadas absolutas
        P2 = LAlgebra.sum(PP2, P);
        P3 = LAlgebra.sum(PP3, P);

        return { p1: P, p2: P2, p3: P3 };
    }
}
