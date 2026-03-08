import type { DrawProps, Object2D } from "../../interfaces/object";
// import type { LinearFunction } from "../../math/functions/linear-function";
import { Point2D } from "../points/point2d";
// import type { Vector2D } from "../vectors/vector2d";

// Da forma ax + by + c = 0
type GeneralFormLine = { a: number; b: number; c: number };

// type PointToPointLine = { p1: Point2D; p2: Point2D };
// type VectorLine = { origin: Point2D; direction_vector: Vector2D };

// type LineData = LinearFunction | VectorLine | PointToPointLine | GeneralFormLine;

// type LineDataType = "function" | "vector" | "point-to-point" | "general-form";

export class Line2D implements Object2D {
    line: GeneralFormLine;

    // TODO: aceitar todos os tipos de representação de retas
    constructor(line: GeneralFormLine /* line_type?: LineDataType*/) {
        this.line = line;
    }

    // Renderiza a reta de um canto da tela ao outro
    draw(canvas_data: DrawProps): void {
        canvas_data.ctx.beginPath();

        // Para que a reta permaneça no local correto
        const scaled_c = this.line.c * canvas_data.unit * canvas_data.zoom;

        const center_x_in_pixels = -canvas_data.offset.x;
        const center_y_in_pixels = -canvas_data.offset.y;

        const vertical_borders_distance_to_center_in_pixels = canvas_data.canvas.width / 2;
        const horizontal_borders_distance_to_center_in_pixels = canvas_data.canvas.height / 2;

        // Coordenadas x's em pixels das bordas laterais da tela
        const left_x = center_x_in_pixels - vertical_borders_distance_to_center_in_pixels;
        const right_x = center_x_in_pixels + vertical_borders_distance_to_center_in_pixels;

        // Coordenadas y's em pixels das bordas superior e inferior da tela
        const top_y = center_y_in_pixels + horizontal_borders_distance_to_center_in_pixels;
        const bottom_y = center_y_in_pixels - horizontal_borders_distance_to_center_in_pixels;

        // Intersecções entre a reta e os 4 cantos da tela
        // (calculado usando uma fórmula derivada do sistema linear entre cada reta-borda e a reta)
        const left_intersect_y = (-scaled_c - left_x * this.line.a) / this.line.b;
        const right_intersect_y = (-scaled_c - right_x * this.line.a) / this.line.b;

        const top_intersect_x = (-scaled_c - top_y * this.line.b) / this.line.a;
        const bottom_intersect_x = (-scaled_c - bottom_y * this.line.b) / this.line.a;

        // Agora, hão 4 pontos possíveis, mas queremos apenas os que estão dentro da tela (nas bordas)
        const candidates_points: Point2D[] = [];

        candidates_points.push(new Point2D({ x: top_intersect_x, y: top_y }));
        candidates_points.push(new Point2D({ x: bottom_intersect_x, y: bottom_y }));
        candidates_points.push(new Point2D({ x: left_x, y: left_intersect_y }));
        candidates_points.push(new Point2D({ x: right_x, y: right_intersect_y }));

        // Filtra somente os pontos válidos (que estão em alguma borda da tela)
        const valid_points = candidates_points.filter((p) => {
            const is_x_inside_range = p.x >= left_x && p.x <= right_x;
            const is_y_inside_range = p.y <= top_y && p.y >= bottom_y;

            return is_x_inside_range && is_y_inside_range;
        });

        if (valid_points.length == 2) {
            canvas_data.ctx.moveTo(valid_points[0].x, valid_points[0].y);
            canvas_data.ctx.lineTo(valid_points[1].x, valid_points[1].y);

            canvas_data.ctx.stroke();
        }

        canvas_data.ctx.closePath();
    }
}
