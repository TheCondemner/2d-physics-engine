/* ----------------------- IMPORTS ---------------------- */
import type { RenderProps, Cartesian } from "../core/common"
import type { Collection } from "./collection"
import { id } from "../core/common"
import _ from "lodash" 

/* ---------------------- VARIABLES --------------------- */

interface Vertex extends Cartesian {
    id: number
}

interface Edge {
    points:   Vertex[]
    internal: boolean
}

type Form = "polygon"|"circle"

/* ----------------------- EXPORT ----------------------- */
class Body {
    // Header
    readonly id:   number               = id.next()
    readonly type: string               = "body"
    name:          string               = "DEFAULT_BODY"
    parent:        null | Collection    = null
    // Engine properties
    delta:         number               = 0
    deltaPrev:     number               = 0
    // Internal
    form:          Form                 = "polygon" // Mostly interpreted in Render, dictates how to display the given object
    position:      Cartesian            = {x: 0, y: 0} // Considers position; measured from top-left
    rotation:      number               = 0 // Angle from positive x-axis in radians
    origin:        Cartesian            = {x: 0, y: 0} // What this.position is translated by for render operations; e.g. set to this.radius to get object center
    // Physics Properties
    center:        Cartesian            = {x: 0, y: 0} // Center of mass of object; set to the center (r, r) at initialization
    static:        boolean              = false // Whether body will be ignored during physics step
    mass:          number               = 1
    velocity:      Cartesian            = {x: 0, y: 0}
    angVelocity:   number               = 0
    airFriction:   number               = 0.01
    // Buffers
    positionPrev:  Cartesian            = {x: 0, y: 0}
    force:         Cartesian            = {x: 0, y: 0} // Buffer: transposed unto velocity at apply step
    torque:        number               = 0 // Buffer; transposed onto angVelocity at apply step
    // Polygonal Properties
    sides:         number               = 5 // 0 if form == circle
    radius:        number               = 100 // Radius of the object; used for Form.Circle/to find where to place points of a regular polygon
    
    vertices:      Vertex[]             = [] // Positions of vertices in relation to the center of the object (differs from the top-left system of the HTML canvas)
    _vertices:     Vertex[]             = [] // Clone of [vertices] at initial position

    edges:         Edge[]               = [] //Contains pairs of coordinates to dictate where to draw edges; not a vector //TODO Consider implementation of Edge[] as a vector
    internalEdges: Edge[]               = [] 
    externalEdges: Edge[]               = [] //! DEPRECIATED IN FAVOR OF VERTEX TRAVERSAL  
    // Form.Polygon where vertexNum === 4
    height:        number               = 0
    width:         number               = 0
    // Render
    render:        Partial<RenderProps> = { fillStyle: "#1f1f1f", strokeStyle: "white", lineWidth: 2 }

    /* ------------------- PUBLIC METHODS ------------------- */
    constructor(options: Partial<Body>) {
        _.merge(this, options)
        this._initProperties()
    }

    // Exponsing _private methods
    public update(dt: number) { this._update(dt)  }
    // Rotate object by [angle=0] degrees
    public rotate(angle: number=0) {
        if (angle===0) return

        // console.log(`.rotate() radians:${angle} initialRot:${this.rotation} newRot:${this.rotation + angle}`)

        this.rotation += angle - ((this.rotation+angle>=2*Math.PI) ? 2*Math.PI : 0)
        this._rotate()
    }

    /* ------------------- PRIVATE METHODS ------------------ */
    private _initProperties() {
        // Permit usage of width/height for rectangles; default to _calculateVertexPos()
        if (this.sides == 4 && this.height !== 0 && this.width !== 0) {
            const width = this.width
            const height = this.height
            this.center = {x: width/2, y: height/2}

            // Define object vertices clockwise; uses 'local' scale, translated by position at render step
            this.vertices = [
                {id: 0, x: 0,     y: 0},
                {id: 1, x: 0,     y: height},
                {id: 2, x: width, y: height},
                {id: 3, x: width, y: 0},
            ]
            this._vertices = _.cloneDeep(this.vertices)
        }
        // Calculate vertices for polygon with n-vertices
        else {
            this.origin = {x: this.radius, y: this.radius} // Move origin to cartesian center
            this.center = {x: this.radius, y: this.radius}
            this.vertices = this._calculateVertexPos(this.sides===0 ? 30 : this.sides) // Make a 30-sided polygon if circle
            this._vertices = _.cloneDeep(this.vertices)
        }

        // Re-calculate edges for each vertex
        [this.edges, this.internalEdges, this.externalEdges] = this._calculateEdges()

        // Rotate to this.rotation
        this._rotate()
    }

    // Update all given physical post-engine-calculations
    private _update(dt: number) {
        // Set default state
        this.deltaPrev = _.clone(this.delta)
        this.delta = dt

        const delta = this.delta
        const delta2 = Math.pow(delta, 2) 
        const velocityPrev = {
            x: (this.position.x - this.positionPrev.x),
            y: (this.position.y - this.positionPrev.y),
        }
        const airFriction = 1 - this.airFriction * delta

        this.velocity.x = (velocityPrev.x * airFriction) + (this.force.x / this.mass) * delta2
        this.velocity.y = (velocityPrev.y * airFriction) + (this.force.y / this.mass) * delta2

        this.positionPrev = _.clone(this.position)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    // Calculate the position of vertices of an n-sided shape, on circle with radius r
    private _calculateVertexPos(n = this.sides, r = this.radius): Vertex[] {
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

                vertices.push({id:i,   x: x, y: -y})
                vertices.push({id:n-i, x: x, y: y })
            }

            vertices.push({id:0,   x: r,  y: 0})
            vertices.push({id:n/2, x: -r, y: 0})
        } 
        // Optimize vertex creation if #vertices is odd; assumes no rotation present
        // Takes (n-1)/2 vertices and calculates their position
        // Duplicates the verticies with sf (1, -1)
        // Adds verticy (r, 0)
        else {
            for (let i = 1; i<=(n-1)/2; i++) {
                const x = r * Math.cos(a*i)
                const y = r * Math.sin(a*i)

                vertices.push({id:i,   x: x, y: -y})
                vertices.push({id:n-i, x: x, y: y })
            }

            vertices.push({id:0, x: r, y: 0})    
        }

        vertices.sort((v1, v2) => v1.id - v2.id)
        return vertices
    }

    // Resolve all edges (internal and external) for given set of vertices
    private _calculateEdges(): Edge[][] {
        const all: Edge[]      = []
        const external: Edge[] = []
        const internal: Edge[] = []

        // Iterate through vertices and get external lines
        for (let i=0; i<this.sides; i++) {
            const edge = {
                points: [
                    this.vertices[i], 
                    this.vertices[(i+1>=this.sides) ? 0 : i+1]
                ],
                internal: false
            }
            all.push(edge)
            external.push(edge)
        }

        // Get internal lines
        const externalFlat = external.map(edge => edge.points)
        // console.log(externalFlat)
        for (let i=0; i<this.sides; i++) {
            for (let j=i+1; j<this.sides; j++) {
                const p1 = this.vertices[i]
                const p2 = this.vertices[j]

                if (externalFlat.includes([p1, p2])) continue

                const edge = {points: [p1, p2], internal: true}
                all.push(edge)
                internal.push(edge)
            }
        }
        
        return [all, internal, external]
    }

    // Body vertices from original position to this.rotation
    private _rotate() {
        const angle = this.rotation
        // console.log(angle)
        
        for (let i = 0; i<this.sides; i++) {
            const x = this._vertices[i].x
            const y = this._vertices[i].y

            const tX = x * Math.cos(angle) - y * Math.sin(angle)
            const tY = y * Math.cos(angle) + x * Math.sin(angle)

            this.vertices[i].x = tX
            this.vertices[i].y = tY
        }
    }
}

export { Body }