<script lang="ts">
	/* ----------------------- IMPORTS ---------------------- */
	import { Collection } from "$lib/physics/objects/collection"
	import { Engine } from "$lib/physics/core/engine"
	import { Body } from "$lib/physics/objects/body"
	import { onMount } from "svelte"

	/* ---------------------- VARIABLES --------------------- */
	// Render viewport
	let wrapper: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let size = { width: 800, height: 600 }; // Static size of the canvas; I don"t particularly think this should change
	let view = { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }; // Location of the viewport in relation to the canvas
	// Render props
	let fps = 60;
	let dfps = fps / 1000;
	let halt = false;
	let delta;
	let time = Date.now();
	let prev = time;
	// Render display config
	const wireframe = true
	const showVertices = true
	const showIDs = true 
	const showOrigin = true
	const showRotation = true
	// Engine props
	let world = new Collection({ name: "World" });
	let engine = new Engine({ world: world })

	// Render objects
	let rect = new Body({
		name: "Rectangle",
		form: "polygon",	
		width: 100,
		height: 50,
		position: {x: 300, y: 300},
		render: {
			fillStyle: "red",
			strokeStyle: "white",
			lineWidth: 3
		},
	})

	world.add([
		rect,
		// rrect
	]);

	/* ---------------------- FUNCTIONS --------------------- */
	function draw() {
		ctx.clearRect(0, 0, size.width, size.height);

		function point(x: number, y: number, color = "red", size = 2) {
			const _strokeStyle = ctx.strokeStyle
			const _fillStyle = ctx.fillStyle
			const _lineWidth = ctx.lineWidth

			ctx.lineWidth = 1
			ctx.strokeStyle = color
			ctx.fillStyle = color
			ctx.fillRect(x-size/2, y-size/2, size, size)

			ctx.strokeStyle = _strokeStyle
			ctx.fillStyle = _fillStyle
			ctx.lineWidth = _lineWidth
		}

		function text(msg="0", x: number, y: number, color="white") {
			const _strokeStyle = ctx.strokeStyle
			const _fillStyle = ctx.fillStyle
			const _lineWidth = ctx.lineWidth

			ctx.fillStyle = "rgba(20, 20, 20, 0.7)"
			ctx.fillRect(x, y-14, ctx.measureText(msg).width, 16)

			ctx.fillStyle = color
			ctx.strokeStyle = color
			ctx.fillText(msg, x, y)

			ctx.strokeStyle = _strokeStyle
			ctx.fillStyle = _fillStyle
			ctx.lineWidth = _lineWidth
		}

		function line(x1: number, y1: number, x2: number, y2: number, c:string="white", l:number=2) {
			const _strokeStyle = ctx.strokeStyle
			const _fillStyle = ctx.fillStyle
			const _lineWidth = ctx.lineWidth

			ctx.strokeStyle = c
			ctx.lineWidth = l

			ctx.beginPath()
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
			ctx.stroke()
			ctx.closePath()

			ctx.strokeStyle = _strokeStyle
			ctx.fillStyle = _fillStyle
			ctx.lineWidth = _lineWidth	
		}

		function _polygon(body: Body) {
			const origin = {
				x: body.position.x + body.origin.x,
				y: body.position.y + body.origin.y
			};

            ctx.font = "16px sans-serif"            
			ctx.strokeStyle = body.render.strokeStyle
			ctx.fillStyle = body.render.fillStyle
			ctx.lineWidth = body.render.lineWidth
            
            ctx.beginPath()

			// Traverse outside vertices; plot external edges
            ctx.moveTo(origin.x + body.vertices[0].x, origin.y + body.vertices[0].y)
            for (let vertex of body.vertices.slice(1)) {
                ctx.lineTo(origin.x + vertex.x, origin.y + vertex.y)
            }
			
			// Fill polygon
			ctx.closePath()
			ctx.stroke()
			if (!wireframe) ctx.fill()

			// Show internal edges in wireframe mode
			if (wireframe) {
				ctx.lineWidth = 1
				ctx.strokeStyle = "gray"
				ctx.beginPath()

				for (let edge of body.internalEdges) {
					// console.log(edge)
					const p1 = edge.points[0]
					const p2 = edge.points[1]
	
					ctx.moveTo(origin.x + p1.x, origin.y + p1.y)
					ctx.lineTo(origin.x + p2.x, origin.y + p2.y)
				}

				ctx.stroke()
				ctx.closePath()
			} 

			// Show rotation
			if (showRotation) {
				// Current rotation
				ctx.lineWidth = 1
				ctx.strokeStyle = "red"

				const rX = origin.x + (body.radius/1.5) * Math.cos(body.rotation)
				const rY = origin.y + (body.radius/1.5) * Math.sin(body.rotation)
				
				ctx.beginPath()
				ctx.moveTo(origin.x, origin.y)
				ctx.lineTo(rX, rY)
				ctx.stroke()
				ctx.closePath()
				// Show rotation at 0 degrees
				ctx.strokeStyle = "green"
				
				ctx.beginPath()
				ctx.moveTo(origin.x, origin.y)
				ctx.lineTo(origin.x + body.radius/1.5, origin.y)
				ctx.stroke()
				ctx.closePath()

				// text(`${this.rotation}`, origin.x + 10, origin.y - 10)
			}

			// Show top-left corner & origin
			if (showOrigin) {
				point(body.position.x, body.position.y, "red")
				point(origin.x, origin.y, "blue")
			} 

			// Plot vertex points & id
			if (showVertices||showIDs) for (let vertex of body.vertices) {
				const tx = origin.x + vertex.x
				const ty = origin.y + vertex.y

				if (showVertices) point(tx, ty, "yellow", 4)
				if (showIDs) text(`${body.id}.${vertex.id}`, tx, ty)
			}
		}

		function _circle(body: Body) {
			const origin = {
				x: body.position.x + body.origin.x,
				y: body.position.y + body.origin.y
			};

			// Show top-left corner
			point(body.position.x, body.position.y, "red");
			// Show origin?
			point(origin.x, origin.y, "blue");

			ctx.beginPath();

			// Draws full circle
			ctx.arc(origin.x, origin.y, body.radius, 0, 2 * Math.PI);

			ctx.stroke();
			// ctx.fill()
			ctx.closePath();
		}

		world.bodies.forEach((body) => {
			switch (body.form) {
				case "polygon":
					_polygon(body)
					break
				case "circle":
					_circle(body)
					break
				default:
					console.log(`Unsupported invalid form ${body.form}`)
			}
		});
	}

	function run() {
		requestAnimationFrame(run);

		if (halt) {
			// console.log("Halting")
			return;
		}

		// Ensure that draw() runs at the dictated FPS
		time = Date.now();
		delta = time - prev;

		if (delta >= dfps) {
			tick(delta);
		}
	}

	function tick(dt: number) {
		console.log("tick")
		engine.step(dt)
		draw()

		// halt = true
	}

	/* ----------------------- RUNTIME ---------------------- */
	onMount(() => {
		// Fetch canvas size at webpage start
		size.width = wrapper.clientWidth;
		size.height = wrapper.clientHeight;

		// Assign default viewport location (encompass entire canvas)
		view.max.x = size.width;
		view.max.y = size.height;

		// Size canvas to fit start size
		canvas.width = size.width;
		canvas.height = size.height;

		ctx = canvas.getContext("2d");

		run();
	});
</script>

<div class="w-full h-full" bind:this={wrapper}>
	<canvas bind:this={canvas} />
</div>
