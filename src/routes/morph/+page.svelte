<script lang="ts">
	import { onMount } from 'svelte';
	import morph from '$lib/morph';
	import { browser } from '$app/environment';
	let container: HTMLDivElement;
	export let data;
	const { pins } = data;

	let images: HTMLImageElement[] = [];
	$: {
		if (pins && pins.length > 0 && browser) {
			pins.forEach((pin, i) => {
				const img = new Image();
				img.src = pin.images['236x'].url;
				img.id = i.toString();
				img.width = pin.images['236x'].width;
				img.height = pin.images['236x'].height;
				images.push(img);
			});
		}
	}

	onMount(() => {
		if (images.length == 0) return;
		morph({
			parent: container,
			intensity1: 1,
			intensity2: 1,
			image1: '/images?url=' + images[0].src,
			image2: '/images?url=' + images[1].src,
			displacementImage: '/images?url=' + images[2].src
		});
	});
</script>

<input
	class="absolute left-5 top-5"
	type="range"
	min="0"
	max="1"
	step="0.1"
	value="0"
	id="sliderx"
/>

<input
	class="absolute left-5 top-36 -rotate-90"
	type="range"
	min="0"
	max="1"
	step="0.1"
	value="0"
	id="slidery"
/>
<div bind:this={container} class="h-screen w-screen" />
