<script lang="ts">
    /* ----------------------- IMPORTS ---------------------- */
    import { onMount } from 'svelte'
    import { Form, Body } from "$lib/physics/objects/body"
	import { Collection } from './physics/objects/collection'

    /* ---------------------- VARIABLES --------------------- */
    let wrapper: HTMLDivElement
    let canvas: HTMLCanvasElement
    let size = {width: 800, height: 600} // Static size of the canvas; I don't particularly think this should change
    let view = {min: {x: 0, y: 0}, max: {x: 0, y: 0}} // Location of the viewport in relation to the canvas 
    
    let world = new Collection({ name: "World" })
    let body = new Body({
        name: "Test Polygon",
        position: {x: 10, y: 10},
        vertexNum: 5,
        render: {
            fillStyle: "red"
        }
    })

    /* ---------------------- FUNCTIONS --------------------- */


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
    })
</script>
    
<div class="w-full h-full" bind:this={wrapper}>
    <canvas bind:this={canvas}></canvas>
</div>
