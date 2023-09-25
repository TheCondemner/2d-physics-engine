/* ----------------------- IMPORTS ---------------------- */


/* ---------------------- VARIABLES --------------------- */
interface RenderOptions {
    width?: number;
    height?: number;
    canvas?: HTMLCanvasElement; // Passed directly or initialized later
    // engine: Engine
    // runner? //* May be replaced with Engine functionality
    view?: { min: {x: number, y: number }, max: {x: number, y: number} }; // Viewport which the render covers; defaults to full canvas size
}

/* ----------------------- EXPORT ----------------------- */
class Render {
    // Defaults
    defaults: RenderOptions = {
        width: 800,
        height: 600,
    }
    render: RenderOptions;

    constructor(data: RenderOptions) {
        // Spread provided parameters onto defaults
        this.render = {
            ...this.defaults, 
            ...data
        };
    };
};

export { Render };