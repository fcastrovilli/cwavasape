<script lang="ts">
	import { started } from '$lib/stores';
	import * as Tone from 'tone';

	async function start() {
		await Tone.start();
		$started = true;
	}
</script>

<div class="flex h-full w-full">
	<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-3xl font-semibold tracking-tight">CWAVASAPE</h1>
			<small class="px-8 text-center text-xs italic text-muted-foreground">Please, explore</small>
		</div>
		<button class="p-8 font-bold text-white" on:click={start}> Start </button>
	</div>
</div>
