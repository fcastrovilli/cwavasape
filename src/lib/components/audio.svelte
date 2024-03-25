<script lang="ts">
	import { browser } from '$app/environment';
	import { scrollPosition } from '$lib/stores';
	import type { RawAudioFiles } from '$lib/types';
	import { random, random_float } from '$lib/utils';
	import { onMount } from 'svelte';

	import * as Tone from 'tone';
	export let urls: RawAudioFiles | undefined = undefined;
	let sampler: Tone.Sampler | undefined = undefined;

	onMount(async () => {
		if (browser && urls && !sampler) {
			sampler = new Tone.Sampler({
				urls: urls,
				baseUrl: '/audio/'
			});
			sampler.volume.value = -5;
			sampler.release = 1;
		}
	});

	$: {
		if (browser && sampler?.loaded && $scrollPosition >= 0) {
			const random_note = random(1, 1000);
			const random_length = random_float(0.1, 2.0);
			console.log(random_note);
			play(random_note, random_length);
		}
	}

	function play(note: number = 1, duration: number = 0.4) {
		if (sampler && sampler.loaded) {
			sampler.triggerAttackRelease([note], duration).toDestination();
		}
	}
</script>

<!-- 
<h1 class="flex h-full w-full items-center justify-center text-3xl">
	{$scrollPosition}
</h1> -->
