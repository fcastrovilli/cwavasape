<script lang="ts">
	import type { PinResponse } from '$lib/types';
	export let data;
	const pins: PinResponse[] | undefined = data.pins;
</script>

{#if pins}
	{#if pins.length > 0}
		{#each pins as pin}
			<div class="flex justify-center items-center p-2 w-full">
				<img
					class="rounded-lg w-screen object-cover"
					loading="lazy"
					src={pin.images['orig'].url}
					alt={pin.pinner.full_name}
				/>
			</div>
		{/each}
	{:else}
		<div class="flex justify-center items-center h-screen">
			<p>no data found</p>
		</div>
	{/if}
{/if}
