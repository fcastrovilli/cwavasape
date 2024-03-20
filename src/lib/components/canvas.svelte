<script lang="ts">
	import { scrollPosition,all_pins } from '$lib/stores';
	import { onMount } from 'svelte';
	import { analyze } from '$lib/utils';
	export let images: HTMLImageElement[] = [];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let img: HTMLImageElement = images[$scrollPosition];
	let analyzed_img: HTMLImageElement;
	let analysis: boolean = false;
	$: url = '/images?url=' + images[$scrollPosition].src;

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
			if(analysis) {
				analyze(analyzed_img,url);
			}
		}
	}
	function draw() {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
	}
</script>

<button on:click={() => (analysis = !analysis)} class:text-black={analysis} class:bg-white={analysis} class="z-50 fixed top-5 right-5 p-2 rounded-lg border border-white text-white align-middle">
	analyze
</button>
<div class="h-screen w-screen flex justify-center items-center">
	<canvas bind:this={canvas} class="max-h-screen object-contain h-full w-full" />
	{#if analysis}
		<img
			bind:this={analyzed_img}
			class="absolute max-h-screen object-contain h-full w-full"
			alt=""
		/>
	{/if}
</div>
