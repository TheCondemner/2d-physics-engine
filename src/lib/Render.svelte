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

    let hexagon = new Body({ position: {x: 10, y: 10}, vertexNum: 6, })
    let octagon = new Body({ position: {x: 310, y: 10}, vertexNum: 8, })
    let decagon = new Body({ position: {x: 610, y: 10}, vertexNum: 10, })

    let triangle = new Body({ position: {x: 10, y: 300}, vertexNum: 3, })
    let pentagon = new Body({ position: {x: 310, y: 300}, vertexNum: 5, })
    let septagon = new Body({ position: {x: 610, y: 300}, vertexNum: 7, })
    
    // let circle = new Body({ position: {x: 810, y: 10 }, radius: 200, form: Form.Circle })
    // let polyCircle = new Body({ position: {x: 810, y: 10}, radius: 200, vertexNum: 30, })
    let rect = new Body({ position: {x: 810, y: 10}, vertexNum: 4})

    world.add([
        octagon,
        decagon,
        hexagon,

        triangle,
        pentagon,
        septagon,

        // circle,
        // polyCircle
        rect
    ])

    /* ---------------------- FUNCTIONS --------------------- */
    function draw() {
        ctx.clearRect(0, 0, size.width, size.height)

        function point(x: number, y: number, color="red", size=2) {
            const _strokeStyle = ctx.strokeStyle
            const _lineWidth = ctx.lineWidth

            ctx.strokeStyle = color
            ctx.lineWidth = 1
            ctx.strokeRect(x, y, size, size)
            ctx.strokeStyle = _strokeStyle
            ctx.lineWidth = _lineWidth
        }

        function _polygon(body: Body) {
            ctx.beginPath()
            
            ctx.strokeStyle = body.render.strokeStyle
            ctx.fillStyle = body.render.fillStyle
            ctx.lineWidth = body.render.lineWidth

            for (let line of body.lines) {
                const p1 = line.points[0]
                const p2 = line.points[1]
                const origin = {
                    x: body.position.x + body.radius,
                    y: body.position.y + body.radius
                }

                // Points
                point(origin.x + p1.x, origin.y + p1.y, "yellow")
                point(origin.x + p2.x, origin.y + p2.y, "yellow")
                // Lines
                ctx.moveTo(origin.x + p1.x, origin.y + p1.y)
                ctx.lineTo(origin.x + p2.x, origin.y + p2.y)
            }

            ctx.stroke()
            // ctx.fill()
            ctx.closePath()

            // Show top-left corner
            point(body.position.x, body.position.y, "red")
            // Show origin?
            point(body.position.x+body.radius, body.position.y+body.radius, "blue")
        }

        function _circle(body: Body) {
            // Show top-left corner
            point(body.position.x, body.position.y, "red")
            // Show origin?
            point(body.position.x+body.radius, body.position.y+body.radius, "blue")

            ctx.beginPath()
            
            ctx.arc(body.position.x+body.radius, body.position.y+body.radius, body.radius, 0, 2*Math.PI)

            ctx.stroke()
            // ctx.fill()
            ctx.closePath()
        }

        world.bodies.forEach(body => {
            if (body.form === Form.Polygon) { 
                _polygon(body)
            } else if (body.form === Form.Circle) {
                console.log("Circle")
                _circle(body)
            }
        });
    }

    function run() {
        requestAnimationFrame(run)
        
        if (halt) { 
            // console.log("Halting")
            return
        }

        // Ensure that draw() runs at the dictated FPS
        time = Date.now()
        delta = time - prev

        console.log(time, delta, dfps, delta >= dfps)

        if (delta >= dfps) {
            draw()
            halt= true
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

        run()
    })
</script>
    
<div class="w-full h-full" bind:this={wrapper}>
    <canvas bind:this={canvas}></canvas>
</div>
