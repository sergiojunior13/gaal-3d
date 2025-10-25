export type DrawProps = {
    ctx: CanvasRenderingContext2D;
    zoom: number;
    canvas: HTMLCanvasElement;
    offset: {
        x: number;
        y: number;
    };
    unit: number;
};

export interface Object2D {
    draw(data: DrawProps): void;
}
