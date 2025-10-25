import type { DrawProps, Object2D } from "../../interfaces/object";

export class Grid2D implements Object2D {
    grid = {
        color: "#0369a1",
        axisColor: "#fff",
        width: 1,
        axisWidth: 2,
    };

    draw = this.renderGrid;

    public renderGrid(data: DrawProps) {
        this.drawGridLines(data);
        this.drawAxes(data);
    }

    private renderGridLines({ ctx, zoom, unit }: DrawProps) {
        ctx.strokeStyle = this.grid.color;
        ctx.lineWidth = this.grid.width * zoom * 0.02 * unit;
        ctx.stroke();
    }

    private renderGridAxes({ ctx, zoom, unit }: DrawProps) {
        ctx.strokeStyle = this.grid.axisColor;
        ctx.lineWidth = this.grid.width * zoom * 0.02 * unit;
        ctx.stroke();
    }

    public drawAxes({ ctx, zoom, canvas, offset, unit }: DrawProps) {
        ctx.beginPath();

        const horizontalBoundary = canvas.width / 2;
        const verticalBoundary = canvas.height / 2;

        // Eixo X
        ctx.moveTo(-horizontalBoundary - offset.x, 0);
        ctx.lineTo(horizontalBoundary - offset.x, 0);

        // Eixo Y
        ctx.moveTo(0, verticalBoundary - offset.y);
        ctx.lineTo(0, -verticalBoundary - offset.y);

        this.renderGridAxes({ ctx, zoom, canvas, offset, unit });
    }

    public drawGridLines({ ctx, zoom, canvas, offset, unit }: DrawProps) {
        const cellSize = unit * zoom;
        ctx.beginPath();

        const horizontalBoundary = canvas.width / 2;
        const verticalBoundary = canvas.height / 2;

        // Desenhar linhas paralelas ao eixo X
        for (
            let y = 0;
            y < verticalBoundary + Math.abs(offset.y);
            y += cellSize
        ) {
            // Desenha a linha em Y+
            ctx.moveTo(-horizontalBoundary - offset.x, y);
            ctx.lineTo(horizontalBoundary - offset.x, y);

            // Desenha a linha em Y-
            ctx.moveTo(-horizontalBoundary - offset.x, -y);
            ctx.lineTo(horizontalBoundary - offset.x, -y);
        }

        // Desenhar linhas paralelas ao eixo Y
        for (
            let x = 0;
            x < horizontalBoundary + Math.abs(offset.x);
            x += cellSize
        ) {
            // Desenha a linha em X+
            ctx.moveTo(x, verticalBoundary - offset.y);
            ctx.lineTo(x, -verticalBoundary - offset.y);

            // Desenha a linha em X-
            ctx.moveTo(-x, verticalBoundary - offset.y);
            ctx.lineTo(-x, -verticalBoundary - offset.y);
        }

        this.renderGridLines({ ctx, zoom, canvas, offset, unit });
    }
}
