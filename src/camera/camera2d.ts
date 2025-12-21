import { LAlgebra } from "../math/linear-algebra/linear-algebra";

export class Camera2D {
    x = 0;
    y = 0;
    zoom = 1;
    mouse = { x: 0, y: 0 };

    onCameraMove?: (x: number, y: number) => any;
    onCameraZoom?: (zoom: number) => any;

    constructor(data?: { x: number; y: number; zoom: number }) {
        if (data) {
            this.x = data.x;
            this.y = data.y;
            this.zoom = data.zoom;
        }
    }

    private recenterCameraToMouse(prevZoom: number, newZoom: number) {
        // Coordenadas da origem em relação à tela do navegador
        const origin = {
            x: document.body.clientWidth / 2 + this.x,
            y: document.body.clientHeight / 2 - this.y,
        };

        // Coordenadas do mouse relativo à origem
        let mouseCoords = LAlgebra.subtract(this.mouse, origin);

        let zoomChangePercentage = (newZoom - prevZoom) / prevZoom;

        // Calcula o quanto cada coordenada do mouse muda quando aplicado o zoom
        let mouseDeltaCoords = LAlgebra.scale(
            mouseCoords,
            zoomChangePercentage
        );

        // Corrige a posição da câmera
        this.x -= mouseDeltaCoords.x;
        this.y += mouseDeltaCoords.y;

        if (this.onCameraMove) this.onCameraMove(this.x, this.y);
    }

    triggerMouseScroll() {
        onwheel = (e) => {
            let prevZoom = this.zoom;

            let zoomSpeed = 1.05;

            this.zoom *= -e.deltaY > 0 ? zoomSpeed : 1 / zoomSpeed;
            if (this.onCameraZoom) this.onCameraZoom(this.zoom);

            this.recenterCameraToMouse(prevZoom, this.zoom);
        };
    }

    triggerMouseDrag() {
        let isDragging = false;

        onmousedown = (e) => {
            e.preventDefault();

            isDragging = true;

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        };

        onmousemove = (e) => {
            let deltaX = e.clientX - this.mouse.x;
            let deltaY = e.clientY - this.mouse.y;

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            if (!isDragging) return;

            this.x += deltaX;
            this.y -= deltaY;

            if (this.onCameraMove) {
                this.onCameraMove(this.x, this.y);
            }
        };

        onmouseup = () => {
            if (!isDragging) return;

            isDragging = false;
        };
    }
}
