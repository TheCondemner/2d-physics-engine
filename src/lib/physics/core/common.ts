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

export interface Cartesian {
    x: number
    y: number
}

export function assign() {  
    
}