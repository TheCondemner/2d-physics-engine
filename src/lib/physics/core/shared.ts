/* ----------------------- IMPORTS ---------------------- */


/* ---------------------- VARIABLES --------------------- */


/* ----------------------- EXPORTS ---------------------- */
export const id = {
    count: -1,
    next: () => {
        id.count += 1
        return id.count
    }
}

export interface RenderProps {
    fillStyle?:   string | CanvasGradient | CanvasPattern
    strokeStyle?: string | CanvasGradient | CanvasPattern
    lineWidth?:   number
}