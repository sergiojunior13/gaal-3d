import { Camera2D } from "../camera/camera2d";
import { LAlgebra } from "../math/linear-algebra/linear-algebra";
import { Grid2D } from "../objects/grids/grid2d";
import { Point2D } from "../objects/points/point2d";
import { Vector2D } from "../objects/vectors/vector2d";
import { Renderer2D } from "../renderer/renderer2d";
import "./style.css";

const renderer = new Renderer2D();

const grid = new Grid2D();
const vector1 = new Vector2D({ p1: { x: 1, y: 3 } }, { color: "blue" });
const vector2 = new Vector2D({ p1: { x: 5, y: 6 } }, { color: "red" });
const vector3 = new Vector2D({ p1: vector1, p2: vector2 });
const v4 = new Vector2D(
    { p1: LAlgebra.subtract(vector2, vector1) },
    { color: "yellow" }
);

const point = new Point2D({ x: 6, y: 6 }, { color: "#0f0" });

renderer.add(grid, vector1, vector2, vector3, v4, point);

renderer.render();

const camera = new Camera2D();

camera.triggerMouseDrag();
camera.triggerMouseScroll();
camera.onCameraMove = renderer.changeOrigin.bind(renderer); // Esse .bind serve pra passar o this correto
camera.onCameraZoom = renderer.changeZoom.bind(renderer);
