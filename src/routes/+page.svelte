<script lang="ts">
	import Canvas from '$lib/components/canvas.svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import type { PinResponse } from '$lib/types';
	import { scrollPosition, settings, started } from '$lib/stores';
	import Start from '$lib/components/start.svelte';
	export let data;
	let pins: PinResponse[] | undefined = data.pins;
	let new_pins: PinResponse[] | undefined = pins;
	let images: HTMLImageElement[] = [];
	let gap: number = 15;
	$: {
		if (new_pins && new_pins.length > 0 && browser) {
			new_pins.forEach((pin, i) => {
				const img = new Image();
				img.src = pin.images[$settings.quality as keyof typeof pin.images].url;
				img.id = i.toString();
				img.width = pin.images['236x'].width;
				img.height = pin.images['236x'].height;
				images.push(img);
			});
		}
	}
	$: bookmark = data.bookmark;
	let btn: HTMLButtonElement;
	let y = 0;
	let touchStart: number = 0;
	$: $scrollPosition = y;

	function refetch() {
		if (!$started) return;
		btn.click();
	}

	function onKeyDown(e: KeyboardEvent) {
		if (!pins || !$started) return;
		if (e.key == 'ArrowUp' && y == 0) return;
		if (e.key == 'ArrowDown' && y == pins.length - 1) return;
		if (e.key == 'ArrowDown' && y == pins.length - gap) {
			y = pins.length - gap + 1;
			// console.log('pinslength:', pins.length, 'y:', y, 'refetching');
			refetch();
		} else if (e.key == 'ArrowDown') y += 1;
		if (e.key == 'ArrowUp') y -= 1;
	}
</script>

<svelte:window on:keydown={onKeyDown} />
{#if !$started}
	<Start />
{:else if pins}
	{#if pins.length > 0}
		<div
			class="h-screen w-screen overflow-hidden"
			on:wheel={(e) => {
				if (!pins) return;
				if (e.deltaY <= 0 && y == 0) return;
				if (e.deltaY >= 0 && y >= pins.length - 1) return;
				if (e.deltaY >= 0 && y == pins.length - gap) {
					y = pins.length - gap + 1;
					// console.log('pinslength:', pins.length, 'y:', y, 'refetching');
					refetch();
				} else if (e.deltaY >= 0 && y !== pins.length - gap) y += 1;
				if (e.deltaY <= 0 && y > 0) y -= 1;
			}}
			on:touchstart={(e) => {
				touchStart = e.changedTouches[0].clientY;
			}}
			on:touchmove={(e) => {
				if (!pins) return;
				const touch = e.changedTouches[0];
				const direction = touchStart < touch.clientY ? 'up' : 'down';
				if (direction == 'up' && y == 0) return;
				if (direction == 'down' && y >= pins.length - 1) return;
				if (direction == 'down' && y == pins.length - gap) {
					y = pins.length - gap + 1;
					// console.log('pinslength:', pins.length, 'y:', y, 'refetching');
					refetch();
				} else if (direction == 'down' && y !== pins.length - gap) y += 1;
				if (direction == 'up' && y > 0) y -= 1;
			}}
		>
			<form
				method="post"
				use:enhance={() => {
					return async ({ result }) => {
						if (!pins) return;
						// @ts-ignore
						if (!result.data) return;
						// @ts-ignore
						new_pins = result.data.new_pins;
						// @ts-ignore
						pins = [...pins, ...result.data.new_pins];
						// @ts-ignore
						bookmark = result.data.new_bookmark;
						// console.log('refetched');
					};
				}}
				action="?/refetch"
			>
				<input type="text" class="hidden" name="bookmark" value={bookmark} />
				<button bind:this={btn} type="submit" class="hidden" />
			</form>
			{#if pins[y] && images.length > 0}
				<Canvas {images} />
			{/if}
		</div>
	{:else}
		<div class="flex h-screen items-center justify-center">
			<p class="text-white">no data found</p>
		</div>
	{/if}
{/if}
