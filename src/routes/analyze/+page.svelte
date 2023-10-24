<script lang="ts">
	import { all_pins, bookmark } from '$lib/stores';
	import type { PinResponse } from '$lib/types.js';
	import Canvas2 from '$lib/components/canvas2.svelte';

	////////// INIT //////////
	export let data;
	let pins: PinResponse[] = data.pins;
	$all_pins = pins;
	let last_bookmark = data.bookmark;
	$bookmark = last_bookmark;

	let started: boolean = false;
</script>

{#if started}
	{#if $all_pins}
		{#if $all_pins.length > 0}
			<Canvas2 />
		{:else}
			<div class="flex justify-center items-center h-screen">
				<p class="text-white">no data found</p>
			</div>
		{/if}
	{/if}
{:else}
	<div class="w-full h-full flex justify-center items-center">
		<button on:click={() => (started = true)} class="p-4 rounded-lg border border-white text-white">
			START
		</button>
	</div>
{/if}
