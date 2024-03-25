<script lang="ts">
	import {
		scrollPosition,
		settings,
		updateLocalStorage,
		show_settings,
		audio_active
	} from '$lib/stores';
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

	$: if (!analysis) url = '';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Settings from './settings.svelte';

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
				analyzeImage();
			}
			draw();
		}
	}
	function draw() {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
	}

	function analyzeImage() {
		if ($scrollPosition === images.indexOf(img)) {
			analyze(src_url).then((result) => {
				if (result) {
					url = result.url;
				}
			});
		}
	}
</script>

{#if $show_settings}
	<Settings bind:analysis on:analyze={() => analyzeImage()} />
{/if}

<ContextMenu.Root closeFocus={() => updateLocalStorage('settings', $settings)}>
	<ContextMenu.Trigger>
		{#if images[$scrollPosition].src}
			<div class="flex h-screen w-screen items-center justify-center">
				<canvas bind:this={canvas} class="h-full max-h-screen w-full object-contain" />
				{#if analysis && url}
					<img
						src={url}
						style="opacity: {$settings.opacity}%;"
						class="absolute h-full max-h-screen w-full object-contain"
						alt=""
					/>
				{/if}
			</div>
		{/if}
	</ContextMenu.Trigger>
	<ContextMenu.Content class="min-w-48">
		<ContextMenu.Item>
			<a href={big_url} rel="nofollow" target="_blank"> Show Original </a>
		</ContextMenu.Item>
		<ContextMenu.Item disabled>Download</ContextMenu.Item>
		<ContextMenu.Separator />
		<ContextMenu.CheckboxItem bind:checked={analysis}>Analyze</ContextMenu.CheckboxItem>
		<ContextMenu.CheckboxItem bind:checked={$audio_active}>Audio</ContextMenu.CheckboxItem>
		<ContextMenu.CheckboxItem bind:checked={$show_settings}>Settings</ContextMenu.CheckboxItem>
		<!-- <ContextMenu.Separator />
		<ContextMenu.RadioGroup
			bind:value
			onValueChange={() => {
				$settings.quality = value;
			}}
		>
			<ContextMenu.Label inset>Image Quality</ContextMenu.Label>
			<ContextMenu.Separator />
			<ContextMenu.RadioItem value="236x">Default</ContextMenu.RadioItem>
			<ContextMenu.RadioItem value="736x">Very Good</ContextMenu.RadioItem>
			<ContextMenu.RadioItem value="orig">Original</ContextMenu.RadioItem>
		</ContextMenu.RadioGroup> -->
		<ContextMenu.Separator />
	</ContextMenu.Content>
</ContextMenu.Root>
