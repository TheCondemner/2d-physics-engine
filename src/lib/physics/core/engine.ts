/* ----------------------- IMPORTS ---------------------- */
import type { Collection } from "../objects/collection"
import type { Body } from "../objects/body"
import { id } from "./shared"
import _ from "lodash"


/* ---------------------- VARIABLES --------------------- */
interface Gravity {
    x: number,
    y: number,
    m: number
}


/* ----------------------- EXPORTS ---------------------- */
class Engine {
    // Header
    readonly id: number = id.next()
    world:       Collection 
    // Physics properties
    gravity:     Gravity = {x: 0, y: 1, m: 0.0001}
    delta:       number = 0
    deltaPrev:   number

    /* ------------------- PUBLIC METHODS ------------------- */
    constructor(options: Partial<Engine>) {
        _.merge(this, options)
    }

    public step(dt: number) {
        this._step(dt)
    }

    /* ------------------- PRIVATE METHODS ------------------ */
    // Move engine by 1 dt in time
    private _step(dt: number) {
        console.log("_step")
        // Set initial step conditions
        const allBodies = this.world.bodies
        this.deltaPrev = this.delta // Update time deltas for new step
        this.delta = dt

        // Cleanup from previous step
        this._clearBuffer(allBodies)

        // Resolve gravity
        this._resolveGravity(allBodies)

        // Update bodies
        this._updateBodies(allBodies, dt)
    }

    private _clearBuffer(bodies: Body|Body[]) {
        // Turn singular/multiple bodies into array
        bodies = [].concat(bodies) 

        for (const body of bodies) {
            body.force.x = 0
            body.force.y = 0
        }
    }

    private _resolveGravity(bodies: Body|Body[]) {
        if ((this.gravity.x === 0 && this.gravity.y === 0) || this.gravity.m === 0) return

        bodies = [].concat(bodies)

        for (const body of bodies) {
            body.force.x += this.gravity.x * this.gravity.m
            body.force.y += this.gravity.y * this.gravity.m
        }
        console.log("_resolvingGravity", bodies)
    }

    private _updateBodies(bodies: Body|Body[], dt: number) {
        bodies = [].concat(bodies)

        for (const body of bodies) body.update(dt)

        console.log("_updatingBodies", bodies)
    }
}

export { Engine }