/* ----------------------- IMPORTS ---------------------- */
import type { RenderProps } from "../core/common";
import type { Collection } from "./collection";

/* ---------------------- VARIABLES --------------------- */
enum Form {
    Polygon,
    Circle,
}

/* ----------------------- EXPORT ----------------------- */
class Body {
    // Header
    readonly id:   number;
    readonly type: string                       = "body"
    name:          string                       = "DEFAULT_BODY"
    parent:        null | Collection            = null
    // Properties
    form:          Form                         = Form.Polygon
    position:      {x: number, y:number}        = {x: 0, y: 0} // Considers position
    vertexNum:     number                       = 0 // 0 if form == Form.Polygon, else 0 < n <= 6? I'm not sure what the upper computational limit will be
    vertecies:     Array<{x: number, y:number}> = []
    // Render
    render:        Partial<RenderProps>         = { fillStyle: "#1f1f1f", strokeStyle: "white", lineWidth: 3 }

    constructor(options: Partial<Body>) {
        Object.assign(this, options)
        console.log(this)
    }
    
    // Methods

}

export { Form, Body }