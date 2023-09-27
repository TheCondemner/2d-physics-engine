/* ----------------------- IMPORTS ---------------------- */
import type { RenderProps } from "../core/common"
import type { Collection } from "./collection"
import _ from "lodash"

/* ---------------------- VARIABLES --------------------- */
enum Form {
    Polygon,
    Circle,
}

interface Coord {
    x: number
    y: number
}

interface Line {
    points:   Array<{ x:number, y:number }>
    internal: boolean
}

/* ----------------------- EXPORT ----------------------- */
class Body {
    // Header
    readonly id:   number;
    readonly type: string               = "body"
    name:          string               = "DEFAULT_BODY"
    parent:        null | Collection    = null
    // Properties
    form:          Form                 = Form.Polygon // Mostly interpreted in Render, dictates how to display the given object
    position:      Coord                = {x: 0, y: 0} // Considers position; uses HTML Canvas positioning
    // Polygonal Properties
    vertexNum:     number               = 5 // 0 if form == Form.Circle
    vertices:      Coord[]              = [] // Positions of vertices in relation to the center of the object (differs from the top-left system of the HTML canvas)
    lines:         Line[]               = [] // Contains pairs of coordinates to dictate where to draw lines; not a vector //TODO Consider implementation of Line[] as a vector
    radius:        number               = 100 // Radius of the object; used for Form.Circle/to find where to place points of a regular polygon
    // Form.Polygon where vertexNum === 4
    height:        number               = 0
    width:         number               = 0
    // Render
    render:        Partial<RenderProps> = { fillStyle: "#1f1f1f", strokeStyle: "white", lineWidth: 1 }

    constructor(options: Partial<Body>) {
        _.merge(this, options)
        console.log(this)

        this._initProperties()
    }
    
    // Methods
    private _initProperties() {
        // Permit usage of width/height for rectangles; default to _calculateVertexPos()
        if (this.vertexNum == 4 && this.height !== 0 && this.width !== 0) {
            const height = this.height
            const width = this.width

            // Define object vertices clockwise; uses 'local' scale, translated by position at render step
            this.vertices = [
                {x: 0,     y: 0},
                {x: 0,     y: height},
                {x: width, y: height},
                {x: width, y: 0},
            ]
        }
        // Initialize bodies of type Form.Circle as having 30 vertices for physics calculations
        else if (this.vertexNum == 0) {
            this.vertices = this._calculateVertexPos(30)
        }
        // Calculate vertices for polygon with n-vertices
        else {
            this.vertices = this._calculateVertexPos(this.vertexNum)
        }
        
        // Re-calculate lines for each vertex
        for (let i=0; i<this.vertexNum; i++) {
            for (let j=i+1; j<this.vertexNum; j++) {
                // console.log(i, j, this.vertices[i], this.vertices[j])
                this.lines.push({
                    points: [
                        { x: this.vertices[i].x, y: this.vertices[i].y },
                        { x: this.vertices[j].x, y: this.vertices[j].y },
                    ],
                    internal: false
                })
            }
        }
    }

    private _calculateVertexPos(n = this.vertexNum, r = this.radius): Coord[] {
        const a = (2 * Math.PI)/n
        const vertices: Coord[] = [];

        // Optimize vertex creation if #vertices is even
        // Takes (n-2)/2 vertices and calculates their position
        // Duplicates the verticies with sf (1, -1)
        // Adds verticy (r, 0) and (-r, 0)
        if (n%2==0) {
            for (let i = 1; i<=(n-2)/2; i++) {
                const x = r * Math.cos(a*i)
                const y = r * Math.sin(a*i)

                vertices.push({ x: x, y: y  })
                vertices.push({ x: x, y: -y })
            }

            vertices.push({ x: r,  y: 0 })
            vertices.push({ x: -r, y: 0 })
        } 
        // Optimize vertex creation if #vertices is odd; assumes no rotation present
        // Takes (n-1)/2 vertices and calculates their position
        // Duplicates the verticies with sf (1, -1)
        // Adds verticy (r, 0)
        else {
            for (let i = 1; i<=(n-1)/2; i++) {
                const x = r * Math.cos(a*i)
                const y = r * Math.sin(a*i)

                vertices.push({ x: x, y: y  })
                vertices.push({ x: x, y: -y })
            }

            vertices.push({ x: r, y: 0 })    
        }

        return vertices
    }
}

export { Form, Body }