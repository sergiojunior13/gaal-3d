import type { DrawProps, Object2D } from "../../interfaces/object";

export class Point2D implements Object2D {
    x = 0;
    y = 0;
    color = "#f00";
    radius = 0.07;

    constructor(p: { x: number; y: number }, options?: { color?: string; radius?: number }) {
        this.x = p.x;
        this.y = p.y;

        if (options) {
            if (options.color) this.color = options.color;
            if (options.radius) this.radius = options.radius;
        }
    }

    draw({ ctx, zoom, unit }: DrawProps) {
        const scale = zoom * unit;

        ctx.beginPath();

        ctx.fillStyle = this.color;
        ctx.arc(this.x * scale, this.y * scale, this.radius * zoom * unit, 0, 2 * Math.PI);

        ctx.fill();

        ctx.closePath();
    }
}
