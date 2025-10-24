export class Camera2D {
    x = 0;
    y = 0;
    zoom = 1;

    onCameraMove?: (x: number, y: number) => any;
    onCameraZoom?: (zoom: number) => any;

    constructor(data?: { x: number; y: number; zoom: number }) {
        if (data) {
            this.x = data.x;
            this.y = data.y;
            this.zoom = data.zoom;
        }
    }

    triggerMouseScroll() {
        onwheel = (e) => {
            this.zoom *= -e.deltaY > 0 ? 1.04 : 0.96;
            if (this.onCameraZoom) this.onCameraZoom(this.zoom);
        };
    }

    triggerMouseDrag() {
        let isDragging = false;
        let startDrag = { x: 0, y: 0 };

        onmousedown = (e) => {
            e.preventDefault();

            isDragging = true;

            startDrag.x = e.clientX;
            startDrag.y = e.clientY;

            onmousemove = (e) => {
                if (!isDragging) return;

                this.x = e.clientX - startDrag.x;
                this.y = e.clientY - startDrag.y;

                startDrag.x = e.clientX;
                startDrag.y = e.clientY;

                if (this.onCameraMove) {
                    this.onCameraMove(this.x, this.y);
                }
            };
        };

        onmouseup = () => {
            if (!isDragging) return;

            isDragging = false;

            onmousemove = null;
        };
    }
}
