<script lang="ts">
	import { scrollPosition } from '$lib/stores';
	import { onMount } from 'svelte';
	export let images: HTMLImageElement[] = [];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let img: HTMLImageElement = images[$scrollPosition];
	onMount(() => {
		ctx = canvas.getContext('2d');
		img = images[$scrollPosition];
		img.onload = () => {
			draw();
		};
	});
	$: {
		if (ctx) {
			img = images[$scrollPosition];
			draw();
		}
	}
	function draw() {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
	}
</script>

<div class="h-screen w-screen flex justify-center items-center">
	<canvas bind:this={canvas} class="max-h-screen object-contain h-full w-full" />
</div>
