/* ----------------------- IMPORTS ---------------------- */
import type { Body } from "./body";

/* ---------------------- VARIABLES --------------------- */


/* ----------------------- EXPORT ----------------------- */
export class Collection {
    // Header
    readonly id:   number;
    readonly type: string            = "collection"
    name:          string            = "DEFAULT_WORLD"
    parent:        object | null     = null
    // Storage
    bodies:        Array<Body>       = []
    collections:   Array<Collection> = []
    // constraints: Array<"">         = []

    constructor(options: Partial<Collection>) {
        Object.assign(this, options)
        console.log(this)
    }

    // Methods
    /* eslint-disable @typescript-eslint/no-explicit-any */ //* Utilized due to the large variety of types that object may be, and, in addition is type-checked later in the method.
    add(object: any) {
        const unfiltered = [].concat(object)
        const objects = unfiltered.filter((item) => typeof item === "object" && Object.hasOwn(item, "type")) // Ensure that objects have a "type" property
        console.log("Collection.add()", objects)

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