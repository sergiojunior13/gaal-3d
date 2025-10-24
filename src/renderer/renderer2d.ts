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

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;

        if (!this.canvas) throw new Error("Falta o elemento <canvas> no HTML");

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!this.ctx) throw new Error("Erro no contexto do canvas");

        this.setCanvasDimensions();
        window.onresize = this.setCanvasDimensions;
    }

    private renderGridLines() {
        this.ctx.strokeStyle = this.grid.color;
        this.ctx.lineWidth = this.grid.width;
        this.ctx.stroke();
    }

    private renderGridAxes() {
        this.ctx.strokeStyle = this.grid.axisColor;
        this.ctx.lineWidth = this.grid.axisWidth;
        this.ctx.stroke();
    }

    public drawAxes() {
        this.ctx.beginPath();

        // Eixo X
        this.ctx.moveTo(-this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, 0);

        // Eixo Y
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(0, -this.canvas.height / 2);

        this.renderGridAxes();
    }

    public drawGrid() {
        const cellSize = this.grid.size;
        this.ctx.beginPath();

        // Desenhar linhas paralelas ao eixo X
        for (let y = 0; y < this.canvas.height / 2; y += cellSize) {
            // Desenha a linha em Y+
            this.ctx.moveTo(-this.canvas.width / 2, y);
            this.ctx.lineTo(this.canvas.width / 2, y);

            // Desenha a linha em Y-
            this.ctx.moveTo(-this.canvas.width / 2, -y);
            this.ctx.lineTo(this.canvas.width / 2, -y);
        }

        // Desenhar linhas paralelas ao eixo Y
        for (let x = 0; x < this.canvas.width / 2; x += cellSize) {
            // Desenha a linha em X+
            this.ctx.moveTo(x, this.canvas.height / 2);
            this.ctx.lineTo(x, -this.canvas.height / 2);

            // Desenha a linha em X-
            this.ctx.moveTo(-x, this.canvas.height / 2);
            this.ctx.lineTo(-x, -this.canvas.height / 2);
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
