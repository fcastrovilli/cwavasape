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
	$: big_url = images[$scrollPosition].src.replace('236x', 'originals');
	$: url = '';
	let opacity = 75;

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
				// url = '';
				if ($scrollPosition === images.indexOf(img)) {
					analyze(src_url).then((result) => {
						if (result) {
							url = result.url;
						}
					});
				}
				// setTimeout(() => {
				// }, 400);
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

<div class="z-50 absolute top-5 right-5">
	<button
		on:click={() => (analysis = !analysis)}
		class:text-black={analysis}
		class:bg-white={analysis}
		class:bg-black={!analysis}
		class:text-white={!analysis}
		class="p-2 rounded-lg border border-white align-middle w-full"
	>
		analyze
	</button>
	{#if analysis}
		<input
			bind:value={opacity}
			type="range"
			min="0"
			max="100"
			step="1"
			class="range accent-black w-full"
		/>
	{/if}
</div>
{#if images[$scrollPosition].src}
	<a href={big_url} rel="nofollow" target="_blank">
		<div class="h-screen w-screen flex justify-center items-center">
			<canvas bind:this={canvas} class="max-h-screen object-contain h-full w-full" />
			{#if analysis && url}
				<img
					src={url}
					style="opacity: {opacity}%;"
					class="absolute max-h-screen object-contain h-full w-full"
					alt=""
				/>
			{/if}
		</div>
	</a>
{/if}
