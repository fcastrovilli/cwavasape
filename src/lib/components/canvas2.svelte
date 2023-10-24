<script lang="ts">
	import { enhance } from '$app/forms';
	import { all_pins, scrollPosition, bookmark } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { MusicData } from '$lib/types';
	import { type Roi, Image as imagejs } from 'image-js';
	import { mapROItoSYNTH, translateRoisToMusic } from '$lib/music/map';
	import * as Tone from 'tone';

	let synth: Tone.PolySynth;

	let canvas: HTMLCanvasElement;
	let analyzed_img: HTMLImageElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let img: HTMLImageElement;
	let gap: number = 15;
	let btn: HTMLButtonElement;
	let y: number = 0;
	$: $scrollPosition = y;
	$: url = '/images?url=' + $all_pins[$scrollPosition].images['orig'].url;

	//////////////////////////
	onMount(async () => {
		synth = new Tone.PolySynth().toDestination();
		ctx = canvas.getContext('2d');
		img = new Image();
		img.src = url;
	});
	$: {
		if (ctx) {
			img.src = url;
			img.onload = () => {
				draw();
			};
		}
	}

	function draw() {
		canvas.width = $all_pins[$scrollPosition].images['orig'].width;
		canvas.height = $all_pins[$scrollPosition].images['orig'].height;
		ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
		analyze();
	}
	function refetch() {
		btn.click();
	}

	async function analyze() {
		let toAnalyze = await imagejs.load(url);
		let gaussian = toAnalyze.grey().gaussianFilter({ radius: 8 });
		let mask = gaussian.mask({ threshold: 0.5 });
		let roiManager = toAnalyze.getRoiManager();
		roiManager.fromMask(mask);
		let painted = roiManager.paint({
			// @ts-ignore
			distinctColor: true,
			positive: true,
			negative: true,
			alpha: 127,
			labelProperty: 'surface',
			labelColor: 'white',
			unit: 'px'
		});
		analyzed_img.src = painted.toDataURL();
		analyzed_img.style.opacity = '0.7';

		let raw_rois = roiManager.getRois({ positive: true, minSurface: 10, negative: true });
		// for (let i = 0; i < rois.length; i++) {
		// 	const note = mapROItoSYNTH(rois[i]);
		// 	console.log(note);
		// 	if (note.duration > 15) note.duration = 15;
		// 	synth.triggerAttackRelease(
		// 		note.notes,
		// 		note.duration * 0.9,
		// 		note.time,
		// 		note.velocity
		// 	);
		// }
		// console.log(rois);
		let musicData: MusicData[] = translateRoisToMusic(raw_rois);
		for (let i = 0; i < musicData.length; i++) {
			const note = musicData[i];
			synth.triggerAttackRelease(
				note.note,
				note.duration * 0.09,
				Tone.now() + i * 0.09,
				note.velocity
			);
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key == 'ArrowUp' && y == 0) return;
		if (e.key == 'ArrowDown' && y == $all_pins.length - 1) return;
		if (e.key == 'ArrowDown' && y == $all_pins.length - gap) {
			y = $all_pins.length - gap + 1;
			// console.log('pinslength:', pins.length, 'y:', y, 'refetching');
			refetch();
		} else if (e.key == 'ArrowDown') y += 1;
		if (e.key == 'ArrowUp') y -= 1;
	}
</script>

<svelte:window on:keydown={onKeyDown} />
<div class="w-screen h-screen overflow-hidden">
	<form
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				// @ts-ignore
				if (!result.data) return;
				// @ts-ignore
				$all_pins = [...result.data.pins];
				// @ts-ignore
				$bookmark = result.data.bookmark;
				console.log('refetched');
			};
		}}
		action="?/refetch"
	>
		<input type="text" class="hidden" name="bookmark" value={$bookmark} />
		<button bind:this={btn} type="submit" class="hidden" />
	</form>
	<div class="h-screen w-screen flex justify-center items-center">
		<canvas bind:this={canvas} class="max-h-screen object-contain h-full w-full" />
		<img
			bind:this={analyzed_img}
			class="absolute max-h-screen object-contain h-full w-full"
			alt=""
		/>
	</div>
</div>
