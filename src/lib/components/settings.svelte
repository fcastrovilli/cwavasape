<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { draggable } from '@neodrag/svelte';
	import { settings, show_settings, updateLocalStorage } from '$lib/stores';
	import { Slider } from './ui/slider';
	import Option from './option.svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	export let analysis: boolean = false;
	const dispatch = createEventDispatcher();
	function analyze() {
		dispatch('analyze');
	}

	onDestroy(() => {
		updateLocalStorage('settings', $settings);
	});
</script>

<div
	use:draggable
	class="absolute left-1/3 top-1/3 z-50 w-full max-w-xs space-y-2 rounded-3xl bg-black p-4 pb-6 outline outline-1 outline-white"
>
	<div class="flex cursor-move justify-between">
		<h3 class="pb-2 text-xl font-semibold">Settings</h3>
		<button on:click={() => ($show_settings = false)}>X</button>
	</div>
	<hr />
	<div class="flex items-center justify-center space-x-2 py-2">
		<Switch id="analyze" bind:checked={analysis} />
		<Label for="analyze" class="font-semibold">Analyze</Label>
	</div>
	<hr />
	<Option label="Opacity" settings_value={$settings.opacity} unity="%">
		<Slider
			value={[$settings.opacity]}
			onValueChange={(e) => ($settings.opacity = e[0])}
			min={0}
			max={100}
			step={1}
		/>
	</Option>
	<Option
		label="Mask Threshold"
		settings_value={Math.round($settings.mask_threshold * 100)}
		unity="%"
	>
		<Slider
			value={[$settings.mask_threshold]}
			onValueChange={(e) => (($settings.mask_threshold = e[0]), analyze())}
			min={0.0}
			max={0.99}
			step={0.01}
		/>
	</Option>
	<Option label="Gaussian Radius" settings_value={$settings.gaussian_radius} unity="px">
		<Slider
			value={[$settings.gaussian_radius]}
			onValueChange={(e) => (($settings.gaussian_radius = e[0]), analyze())}
			min={0}
			max={20}
			step={1}
		/>
	</Option>
	<Option label="Paint Alpha" settings_value={$settings.paint_alpha} unity="">
		<Slider
			value={[$settings.paint_alpha]}
			onValueChange={(e) => (($settings.paint_alpha = e[0]), analyze())}
			min={0}
			max={2000}
			step={1}
		/>
	</Option>
</div>
