import { Camera2D } from "../camera/camera2d";
import { Renderer2D } from "../renderer/renderer2d";
import "./style.css";

const renderer = new Renderer2D();

renderer.renderGrid();

const camera = new Camera2D();

camera.triggerMouseDrag();
camera.triggerMouseScroll();
camera.onCameraMove = renderer.changeOrigin.bind(renderer); // Esse .bind serve pra passar o this correto
camera.onCameraZoom = renderer.changeScale.bind(renderer);
