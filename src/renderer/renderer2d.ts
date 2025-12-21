import type { Object2D } from "../interfaces/object";

export class Renderer2D {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    offset = {
        x: 0,
        y: 0,
    };

    zoom = 1;
    unit = 100;

    objectsToRender: Object2D[] = [];

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;

        if (!this.canvas) throw new Error("Falta o elemento <canvas> no HTML");

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!this.ctx) throw new Error("Erro no contexto do canvas");

        this.setCanvasDimensions();

        window.onresize = () => {
            this.setCanvasDimensions();
            this.render();
        };
    }

    public add(...objects: Object2D[]) {
        objects.forEach((obj) => {
            this.objectsToRender.push(obj);

            obj.draw({
                canvas: this.canvas,
                ctx: this.ctx,
                offset: this.offset,
                zoom: this.zoom,
                unit: this.unit,
            });
        });
    }

    public render() {
        this.clearScreen();

        this.objectsToRender.forEach((object) => {
            object.draw({
                canvas: this.canvas,
                ctx: this.ctx,
                offset: this.offset,
                zoom: this.zoom,
                unit: this.unit,
            });
        });
    }

    private clearScreen() {
        this.ctx.save();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.restore();
    }

    public changeZoom(newZoom: number) {
        this.zoom = newZoom;

        this.render();
    }

    private setCenterOrigin() {
        // Resetar todas as transformações
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Move a origem para o centro da tela
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        // Faz o y crescer para cima
        this.ctx.scale(1, -1);
    }

    public changeOrigin(newX: number, newY: number) {
        // Move a origem para o centro da tela
        this.setCenterOrigin();

        // Move a origem de fato
        this.ctx.translate(newX, newY);

        this.offset.x = newX;
        this.offset.y = newY;

        this.render();
    }

    private setCanvasDimensions() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.canvas.width = width;
        this.canvas.height = height;

        // Mudar a origem das coordenadas do canvas para o centro da tela
        this.ctx.save();
        this.setCenterOrigin();
    }
}
