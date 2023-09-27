<script lang="ts">
	/* ----------------------- IMPORTS ---------------------- */
	import { onMount } from 'svelte';
	import { Body } from '$lib/physics/objects/body';
	import { Collection } from './physics/objects/collection';

	/* ---------------------- VARIABLES --------------------- */
	// Render viewport
	let wrapper: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let size = { width: 800, height: 600 }; // Static size of the canvas; I don't particularly think this should change
	let view = { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }; // Location of the viewport in relation to the canvas

	// Render config
	let fps = 60;
	let dfps = fps / 1000;
	let halt = false;
	let delta;
	let time = Date.now();
	let prev = time;

	// Render objects
	let world = new Collection({ name: 'World' });

	let hexagon = new Body({ position: { x: 10, y: 10 }, vertexNum: 6 });
	let octagon = new Body({ position: { x: 310, y: 10 }, vertexNum: 8 });
	let decagon = new Body({ position: { x: 610, y: 10 }, vertexNum: 10 });

	let triangle = new Body({ position: { x: 10, y: 300 }, vertexNum: 3 });
	let pentagon = new Body({ position: { x: 310, y: 300 }, vertexNum: 5 });
	let septagon = new Body({ position: { x: 610, y: 300 }, vertexNum: 7 });

	// let circle = new Body({ position: {x: 810, y: 10 }, radius: 200, form: Form.Circle })
	// let polyCircle = new Body({ position: {x: 810, y: 10}, radius: 200, vertexNum: 30, })
	let rect = new Body({ position: { x: 810, y: 10 }, vertexNum: 4, width: 100, height: 50 });

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
	]);

	/* ---------------------- FUNCTIONS --------------------- */
	function draw() {
		ctx.clearRect(0, 0, size.width, size.height);

		function point(x: number, y: number, color = 'red', size = 2) {
			const _strokeStyle = ctx.strokeStyle;
			const _lineWidth = ctx.lineWidth;

			ctx.strokeStyle = color;
			ctx.lineWidth = 1;
			ctx.strokeRect(x, y, size, size);
			ctx.strokeStyle = _strokeStyle;
			ctx.lineWidth = _lineWidth;
		}

		function _polygon(body: Body) {
			const origin = {
				x: body.position.x + body.origin.x,
				y: body.position.y + body.origin.y
			};

            ctx.font = "16px serif"

			ctx.beginPath();

			ctx.strokeStyle = body.render.strokeStyle;
			ctx.fillStyle = body.render.fillStyle;
			ctx.lineWidth = body.render.lineWidth;

			for (let line of body.edges) {
                if (line.internal) {
                    continue
                }

				const p1 = line.points[0];
				const p2 = line.points[1];

                ctx.fillText(`${p1.id}`, origin.x + p1.x+5, origin.y + p1.y+5)
                ctx.fillText(`${p2.id}`, origin.x + p2.x+5, origin.y + p2.y+5)

				// Points
				point(origin.x + p1.x, origin.y + p1.y, 'yellow');
				point(origin.x + p2.x, origin.y + p2.y, 'yellow');
				// edges
				ctx.moveTo(origin.x + p1.x, origin.y + p1.y);
				ctx.lineTo(origin.x + p2.x, origin.y + p2.y);

                ctx.fillStyle = "white"
                ctx.fillText(`${p1.id}`, origin.x + p1.x+5, origin.y + p1.y+5)
                ctx.fillText(`${p2.id}`, origin.x + p2.x+5, origin.y + p2.y+5)
			}

			ctx.stroke();
			// ctx.fill()
			ctx.closePath();

			// Show top-left corner
			point(body.position.x, body.position.y, 'red');
			// Show origin?
			point(origin.x, origin.y, 'blue');
		}

		function _circle(body: Body) {
			const origin = {
				x: body.position.x + body.origin.x,
				y: body.position.y + body.origin.y
			};

			// Show top-left corner
			point(body.position.x, body.position.y, 'red');
			// Show origin?
			point(origin.x, origin.y, 'blue');

			ctx.beginPath();

			// Draws full circle
			ctx.arc(origin.x, origin.y, body.radius, 0, 2 * Math.PI);

			ctx.stroke();
			// ctx.fill()
			ctx.closePath();
		}

		world.bodies.forEach((body) => {
			if (body.form === 'polygon') {
				_polygon(body);
			} else if (body.form === 'circle') {
				_circle(body);
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
			tick();
		}
	}

	function tick() {
		draw();

		halt = true;
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

		ctx = canvas.getContext('2d');

		run();
	});
</script>

<div class="w-full h-full" bind:this={wrapper}>
	<canvas bind:this={canvas} />
</div>
