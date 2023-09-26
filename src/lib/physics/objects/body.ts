/* ----------------------- IMPORTS ---------------------- */
import type { RenderProps } from "../core/common"
import type { Collection } from "./collection"
import _ from "lodash"

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
    vertices:      Array<{x: number, y:number}> = []
    // Form.Polygon, where vertexNum === 4
    width?:        number                       = 40
    height?:       number
    // Form.Polygon where vertexNum !== 4 || Form.Circle
    radius:        number                       = 10
    // Render
    render:        Partial<RenderProps>         = { fillStyle: "#1f1f1f", strokeStyle: "white", lineWidth: 3 }

    constructor(options: Partial<Body>) {
        _.merge(this, options)
        console.log(this)

        this._initProperties()
    }
    
    // Methods
    private _initProperties() {
        if (this.vertexNum == 4) {
            const height = this.height||30
            const width = this.width||40

            // Define object vertices clockwise; uses 'local' scale, translated by position at render step
            this.vertices = [
                {x: 0,     y: 0},
                {x: 0,     y: height},
                {x: width, y: height},
                {x: width, y: 0},
            ]
        } else {
            for (let i = 0; i++; i<=this.vertexNum) {
                const x = this.radius * Math.acos((360/this.vertexNum)*i)
                const y = this.radius * Math.asin((360/this.vertexNum)*i)

                this.vertices.push({x: x, y: y})
            }
            console.log(this.vertices)
        }
    }
}

export { Form, Body }