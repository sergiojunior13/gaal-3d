import type { DrawProps, Object2D } from "../../interfaces/object";

export class Point2D implements Object2D {
    x = 0;
    y = 0;
    color = "#f00";

    constructor(p: { x: number; y: number }, options?: { color?: string }) {
        this.x = p.x;
        this.y = p.y;

        if (options) {
            if (options.color) this.color = options.color;
        }
    }

    draw({ ctx, zoom, unit }: DrawProps) {
        const scale = zoom * unit;

        ctx.beginPath();

        ctx.fillStyle = this.color;
        ctx.arc(
            this.x * scale,
            this.y * scale,
            0.07 * zoom * unit,
            0,
            2 * Math.PI
        );

        ctx.fill();
    }
}
