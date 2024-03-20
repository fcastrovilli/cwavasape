<script lang="ts">
	import { scrollPosition } from '$lib/stores';
	import { onMount } from 'svelte';
	import { analyze } from '$lib/utils';
	export let images: HTMLImageElement[] = [];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let img: HTMLImageElement = images[$scrollPosition];
	let analysis: boolean = false;
	$: src_url = '/images?url=' + images[$scrollPosition].src;
	$: url = '';

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
			if (analysis) {
				url = '';
				setTimeout(() => {
					if ($scrollPosition === images.indexOf(img)) {
						analyze(src_url).then((result) => {
							if (result) {
								url = result.url;
							}
						});
					}
				}, 400);
			}
			draw();
		}
	}
	function draw() {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
	}
</script>

<button
	on:click={() => (analysis = !analysis)}
	class:text-black={analysis}
	class:bg-white={analysis}
	class:bg-black={!analysis}
	class:text-white={!analysis}
	class="z-50 absolute top-5 right-5 p-2 rounded-lg border border-white align-middle"
>
	analyze
</button>
{#if images[$scrollPosition].src}
	<a href={images[$scrollPosition].src} rel="nofollow" target="_blank">
		<div class="h-screen w-screen flex justify-center items-center">
			<canvas bind:this={canvas} class="max-h-screen object-contain h-full w-full" />
			{#if analysis && url}
				<img
					src={url}
					class="opacity-70 absolute max-h-screen object-contain h-full w-full"
					alt=""
				/>
			{/if}
		</div>
	</a>
{/if}
