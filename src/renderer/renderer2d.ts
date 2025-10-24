export class Renderer2D {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    grid = {
        color: "#3f3f46",
        axisColor: "#a1a1aa",
        width: 1,
        axisWidth: 2,
        size: 40,
    };

    offset = {
        x: 0,
        y: 0,
    };

    scale = 1;

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;

        if (!this.canvas) throw new Error("Falta o elemento <canvas> no HTML");

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!this.ctx) throw new Error("Erro no contexto do canvas");

        this.setCanvasDimensions();
        window.onresize = this.setCanvasDimensions;
    }

    private clearScreen() {
        this.ctx.save();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.restore();
    }

    public changeOrigin(newX: number, newY: number) {
        this.clearScreen();

        this.ctx.translate(newX, -newY);
        this.offset.x += newX;
        this.offset.y -= newY;

        this.renderGrid();
    }

    public changeScale(newScale: number) {
        this.clearScreen();

        this.scale = newScale;

        this.renderGrid();
    }

    public renderGrid() {
        this.drawGridLines();
        this.drawAxes();
    }

    private renderGridLines() {
        this.ctx.strokeStyle = this.grid.color;
        this.ctx.lineWidth = this.grid.width * this.scale;
        this.ctx.stroke();
    }

    private renderGridAxes() {
        this.ctx.strokeStyle = this.grid.axisColor;
        this.ctx.lineWidth = this.grid.axisWidth * this.scale;
        this.ctx.stroke();
    }

    public drawAxes() {
        this.ctx.beginPath();

        const horizontalBoundary = this.canvas.width / 2;
        const verticalBoundary = this.canvas.height / 2;

        // Eixo X
        this.ctx.moveTo(-horizontalBoundary - this.offset.x, 0);
        this.ctx.lineTo(horizontalBoundary - this.offset.x, 0);

        // Eixo Y
        this.ctx.moveTo(0, verticalBoundary - this.offset.y);
        this.ctx.lineTo(0, -verticalBoundary - this.offset.y);

        this.renderGridAxes();
    }

    public drawGridLines() {
        const cellSize = this.grid.size * this.scale;
        this.ctx.beginPath();

        const horizontalBoundary = this.canvas.width / 2;
        const verticalBoundary = this.canvas.height / 2;

        // Desenhar linhas paralelas ao eixo X
        for (
            let y = 0;
            y < verticalBoundary + Math.abs(this.offset.y);
            y += cellSize
        ) {
            // Desenha a linha em Y+
            this.ctx.moveTo(-horizontalBoundary - this.offset.x, y);
            this.ctx.lineTo(horizontalBoundary - this.offset.x, y);

            // Desenha a linha em Y-
            this.ctx.moveTo(-horizontalBoundary - this.offset.x, -y);
            this.ctx.lineTo(horizontalBoundary - this.offset.x, -y);
        }

        // Desenhar linhas paralelas ao eixo Y
        for (
            let x = 0;
            x < horizontalBoundary + Math.abs(this.offset.x);
            x += cellSize
        ) {
            // Desenha a linha em X+
            this.ctx.moveTo(x, verticalBoundary - this.offset.y);
            this.ctx.lineTo(x, -verticalBoundary - this.offset.y);

            // Desenha a linha em X-
            this.ctx.moveTo(-x, verticalBoundary - this.offset.y);
            this.ctx.lineTo(-x, -verticalBoundary - this.offset.y);
        }

        this.renderGridLines();
    }

    private setCanvasDimensions() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.canvas.width = width;
        this.canvas.height = height;

        // Mudar a origem das coordenadas do canvas para o centro da tela
        this.ctx.save();
        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(1, -1); // Faz o y crescer para cima
    }
}
