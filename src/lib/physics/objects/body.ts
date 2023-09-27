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

interface Vertex extends Coord {
    id: number
}

interface Edge {
    points:   Vertex[]
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
    form:          "polygon"|"circle"   = "polygon" // Mostly interpreted in Render, dictates how to display the given object
    position:      Coord                = {x: 0, y: 0} // Considers position; measured from top-left
    origin:        Coord                = {x: 0, y: 0} // What this.position is translated by for render operations; e.g. set to this.radius to get object center
    // Polygonal Properties
    vertexNum:     number               = 5 // 0 if form == circle
    vertices:      Vertex[]             = [] // Positions of vertices in relation to the center of the object (differs from the top-left system of the HTML canvas)
    edges:         Edge[]               = [] // Contains pairs of coordinates to dictate where to draw edges; not a vector //TODO Consider implementation of Edge[] as a vector
    radius:        number               = 100 // Radius of the object; used for Form.Circle/to find where to place points of a regular polygon
    // Form.Polygon where vertexNum === 4
    height:        number               = 0
    width:         number               = 0
    // Render
    render:        Partial<RenderProps> = { fillStyle: "#1f1f1f", strokeStyle: "white", lineWidth: 1 }

    constructor(options: Partial<Body>) {
        _.merge(this, options)
        this._initProperties()
    }
    
    // Methods
    private _initProperties() {
        // Permit usage of width/height for rectangles; default to _calculateVertexPos()
        if (this.vertexNum == 4 && this.height !== 0 && this.width !== 0) {
            const width = this.width
            const height = this.height

            // Define object vertices clockwise; uses 'local' scale, translated by position at render step
            this.vertices = [
                {id: 0, x: 0,     y: 0},
                {id: 1, x: 0,     y: height},
                {id: 2, x: width, y: height},
                {id: 3, x: width, y: 0},
            ]
        }
        // Initialize bodies of type Form.Circle as having 30 vertices for physics calculations
        else if (this.vertexNum == 0) {
            this.origin = {x: this.radius, y: this.radius} // Move origin to cartesian center
            this.vertices = this._calculateVertexPos(30)
        }
        // Calculate vertices for polygon with n-vertices
        else {
            this.origin = {x: this.radius, y: this.radius} // Move origin to cartesian center
            this.vertices = this._calculateVertexPos()
        }
        
        // Re-calculate edges for each vertex
        this.edges = this._calculateEdges()
    }

    private _calculateVertexPos(n = this.vertexNum, r = this.radius): Vertex[] {
        const a = (2 * Math.PI)/n
        const vertices: Vertex[] = [];

        // Optimize vertex creation if #vertices is even
        // Takes (n-2)/2 vertices and calculates their position
        // Duplicates the verticies with sf (1, -1)
        // Adds verticy (r, 0) and (-r, 0)
        if (n%2==0) {
            for (let i = 1; i<=(n-2)/2; i++) {
                const x = r * Math.cos(a*i)
                const y = r * Math.sin(a*i)

                vertices.push({id:(i-1),   x: x, y: y })
                vertices.push({id:(n-1-i), x: x, y: -y})
            }

            vertices.push({id:(n-1),   x: r,  y: 0})
            vertices.push({id:(n/2)-1, x: -r, y: 0})
        } 
        // Optimize vertex creation if #vertices is odd; assumes no rotation present
        // Takes (n-1)/2 vertices and calculates their position
        // Duplicates the verticies with sf (1, -1)
        // Adds verticy (r, 0)
        else {
            for (let i = 1; i<=(n-1)/2; i++) {
                const x = r * Math.cos(a*i)
                const y = r * Math.sin(a*i)

                vertices.push({id:(i-1),   x: x, y: y })
                vertices.push({id:(n-i-1), x: x, y: -y})
            }

            vertices.push({id:(n-1), x: r, y: 0})    
        }

        return vertices
    }

    private _calculateEdges(n = this.vertexNum): Edge[] {
        const edges: Edge[] = []

        for (let i=0; i<n; i++) {
            for (let j=i+1; j<n; j++) {
                const p1 = this.vertices[i]
                const p2 = this.vertices[j]
                // Calculate if the edge is internal
                const external = (p1.id+1===p2.id)||(p1.id-1===p2.id)||(p1.id-1<0&&p2.id===n-1)

                edges.push({
                    points: [p1, p2],
                    internal: !external
                })
            }
        }

        return edges
    }
}

export { Form, Body }