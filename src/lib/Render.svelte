<script lang="ts">
    /* ----------------------- IMPORTS ---------------------- */
    import { onMount } from 'svelte'
    import { Form, Body } from "$lib/physics/objects/body"
	import { Collection } from './physics/objects/collection'

    /* ---------------------- VARIABLES --------------------- */
    // Render viewport
    let wrapper: HTMLDivElement
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let size = {width: 800, height: 600} // Static size of the canvas; I don't particularly think this should change
    let view = {min: {x: 0, y: 0}, max: {x: 0, y: 0}} // Location of the viewport in relation to the canvas 
    
    // Render config
    let fps = 60
    let dfps = fps/1000
    let halt = false
    let delta
    let time = Date.now()
    let prev = time
    
    // Render objects
    let world = new Collection({ name: "World" })
    let body = new Body({
        name: "Test Polygon",
        position: {x: 100, y: 100},
        width: 100,
        height: 200,
        vertexNum: 5,
        render: {
            fillStyle: "blue",
            lineWidth: 10,
        }
    })

    world.add([
        body,
    ])

    /* ---------------------- FUNCTIONS --------------------- */
    function draw() {
        console.log("draw()")

        ctx.clearRect(0, 0, size.width, size.height)

        function _polygon(body: Body) {
            console.log("body")

            ctx.strokeStyle = body.render.strokeStyle
            ctx.fillStyle = body.render.fillStyle
            ctx.lineWidth = body.render.lineWidth

            ctx.beginPath()
            ctx.moveTo(body.position.x + body.vertices[0].x, body.position.y + body.vertices[0].y)

            for (let vertex of body.vertices) ctx.lineTo(body.position.x + vertex.x, body.position.y + vertex.y) 

            ctx.closePath()
            ctx.stroke()
            ctx.fill()
        }

        world.bodies.forEach(body => {
            console.log("body", body, body.form)
            if (body.form === Form.Polygon) { 
                console.log("polygon")
                _polygon(body)
            }
        });
    }

    function run() {
        requestAnimationFrame(run)
        
        if (halt) { 
            console.log("Halting")
            return
        }

        // Ensure that draw() runs at the dictated FPS
        time = Date.now()
        delta = time - prev

        console.log(time, delta, dfps, delta >= dfps)

        if (delta >= dfps) {
            draw()
        }
    }

    function tick() {

    }

    /* ----------------------- RUNTIME ---------------------- */
    onMount(() => {
        // Fetch canvas size at webpage start
        size.width = wrapper.clientWidth
        size.height = wrapper.clientHeight

        // Assign default viewport location (encompass entire canvas)
        view.max.x = size.width
        view.max.y = size.height

        // Size canvas to fit start size
        canvas.width = size.width
        canvas.height = size.height

        ctx = canvas.getContext("2d")

        // run()
    })
</script>
    
<div class="w-full h-full" bind:this={wrapper}>
    <canvas bind:this={canvas}></canvas>
</div>
