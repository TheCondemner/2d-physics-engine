/* ----------------------- IMPORTS ---------------------- */
import _ from "lodash"

/* ---------------------- VARIABLES --------------------- */
// Support for vector-like objects, but those that do not have all the underlying functions
interface Vector2 {
    x: number,
    y: number
}

type MinOne<T=Vector2> = [T, ...T[]]
type MinTwo<T=Vector2> = [T, T, ...T[]]

/* ----------------------- EXPORTS ---------------------- */
// class Vector {
//     x: number = 0
//     y: number = 0

//     /* --------------------- PROPERTIES --------------------- */
//     get magnitude() {
//         return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
//     }

//     /* ----------------------- METHODS ---------------------- */
//     constructor(options: Partial<Vector>) { _.merge(this, options) }

//     // Basic mathematical operations
//     public add(vector: Vector|Vector2) {
//         return new Vector({x: this.x + vector.x, y: this.y + vector.y})
//     }

//     public sub(vector: Vector|Vector2) {
//         return new Vector({x: this.x - vector.x, y: this.y - vector.y})
//     }

//     public mul(vector: Vector|Vector2) {
//         return new Vector({x: this.x * vector.x, y: this.y * vector.y})
//     }

//     public div(vector: Vector|Vector2) {
//         return new Vector({x: this.x / vector.x, y: this.y / vector.y})
//     }

//     // Vector math
//     public normalise() {
//         const magnitude = this.magnitude
//         if (magnitude === 0) { return new Vector({x: 0, y: 0}) }
//         return new Vector({ x: this.x / magnitude, y: this.y / magnitude })
//     }

//     public perpenducular() {
//         return new Vector({ x: -this.y, y: this.x })
//     }

//     public dot(vector: Vector|Vector2) {
//         return (this.x * vector.x) + (this.y * vector.y)
//     }

//     public cross(vector: Vector|Vector2) {
//         return (this.x * vector.y) - (this.y * vector.x)
//     }
// }

class Vector {
    /* ------------------- MULT-PARAMETER ------------------- */
    // Arithmetic operations
    static add(vectors: MinTwo): Vector2 {
        return {
            x: _.sum(vectors.map(vector => vector.x)), 
            y: _.sum(vectors.map(vector => vector.y))
        }
    }

    static sub(vectors: MinTwo): Vector2 {
        return {
            x: vectors[0].x - _.sum(vectors.splice(0, 1).map(vector => vector.x)),
            y: vectors[0].y - _.sum(vectors.splice(0, 1).map(vector => vector.y)),
        }
    }

    static mul(vectors: MinTwo): Vector2 {
        let x = vectors[0].x
        let y = vectors[0].y

        for (const vector of vectors.splice(0, 1)) {
            x *= vector.x
            y *= vector.y
        }

        return {x: x, y: y}
    }

    static div(vectors: MinTwo) {
        let x = vectors[0].x
        let y = vectors[0].y

        for (const vector of vectors.splice(0, 1)) {
            x /= vector.x
            y /= vector.y
        }

        return {x: x, y: y}
    }

    static magnitudeM(vector: MinOne): number[] {
        const vectors = [].concat(vector)
            .map(vec => Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2)))
        return vectors
    }

    static normaliseM(vector: MinOne): Vector2[] {
        const vectors = [].concat(vector)
            .map(vec => ({
                x: vec.x / this.magnitude(vec),
                y: vec.y / this.magnitude(vec)
            }))
        return vectors
    }

    /* ------------------ SINGLE PARAMETER ------------------ */
    static magnitude(vector: Vector2): number {
        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
    }

    static normalise(vector: Vector2): Vector2 {
        const magnitude = this.magnitude(vector)
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        }
    }
}

export { Vector, type Vector2 }