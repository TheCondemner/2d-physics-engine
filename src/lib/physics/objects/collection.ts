/* ----------------------- IMPORTS ---------------------- */


/* ---------------------- VARIABLES --------------------- */
interface CollectionData {
    name?:   string;
    parent?: object;
}

/* ----------------------- EXPORT ----------------------- */
export class Collection implements CollectionData {
    readonly id: number;
    name:        string            = "World";
    parent:      object|null       = null;
    // Object storage
    bodies:      Array<"">         = [];
    // constraints: Array<"">         = [];
    collections: Array<Collection> = [];

    constructor(params: CollectionData) {
        this.name = params.name||this.name
        this.parent = params.parent||this.parent
    }
}