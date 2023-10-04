/* ----------------------- IMPORTS ---------------------- */
import { id } from "../core/common"
import type { Body } from "./body"
import _ from "lodash"

/* ---------------------- VARIABLES --------------------- */


/* ----------------------- EXPORT ----------------------- */
export class Collection {
    // Header
    readonly id:   number            = id.next()
    readonly type: string            = "collection"
    name:          string            = "DEFAULT_WORLD"
    parent:        object | null     = null
    // Storage
    bodies:        Array<Body>       = []
    collections:   Array<Collection> = []
    // constraints: Array<"">         = []

    constructor(options: Partial<Collection>) {
        _.merge(this, options)
    }

    // Methods
    /* eslint-disable @typescript-eslint/no-explicit-any */ //* Utilized due to the large variety of types that object may be, and, in addition is type-checked later in the method.
    add(object: any) {
        const unfiltered = [].concat(object)
        const objects = unfiltered.filter((item) => typeof item === "object" && Object.hasOwn(item, "type")) // Ensure that objects have a "type" property

        // Iterate through filtered objects and perform required append operations
        for (object of objects) {
            switch (object.type) {
                case "body":
                    this.bodies.push(object);
                    console.log(`Adding body "${object.name}" to Collection.`)
                    break
                case "collection":
                    this.collections.push(object);
                    console.log(`Adding collection "${object.name}" to Collection.`)
                    break
                default:
                    console.log(`Invalid type "${object.type}" provided to Collection.add().`, object)
            }
        }
    }
}