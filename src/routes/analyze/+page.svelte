<script lang="ts">
	import { all_pins, bookmark } from '$lib/stores';
	import type { PinResponse } from '$lib/types.js';
	import Canvas from '$lib/components/canvas-analyze.svelte';

	////////// INIT //////////
	export let data;
	let pins: PinResponse[] = data.pins;
	$all_pins = pins;
	let last_bookmark = data.bookmark;
	$bookmark = last_bookmark;
</script>

{#if $all_pins}
	{#if $all_pins.length > 0}
		<Canvas />
	{:else}
		<div class="flex justify-center items-center h-screen">
			<p class="text-white">no data found</p>
		</div>
	{/if}
{/if}
