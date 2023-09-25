/* ----------------------- IMPORTS ---------------------- */
import type { Collection } from "./collection";

/* ---------------------- VARIABLES --------------------- */
enum BodyType {
    Poly,
    Circle,
}

/* ----------------------- EXPORT ----------------------- */
class Body {
    name?:     string                = "World";
    parent?:   null|Collection       = null;
    type?:     BodyType              = BodyType.Poly;
    position?: {x: number, y:number} = {x: 0, y: 0};

    constructor(option: Partial<Body>) {
        Object.assign(this, option);
        console.log(this);
    }
}

export { BodyType, Body }