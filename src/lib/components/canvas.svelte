<script lang="ts">
	import { scrollPosition, settings } from '$lib/stores';
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
	import { Slider } from '$lib/components/ui/slider';
	import ContextMenuLabel from './ui/context-menu/context-menu-label.svelte';

	// let value = $settings.quality;

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

<ContextMenu.Root>
	<ContextMenu.Trigger>
		{#if images[$scrollPosition].src}
			<a href={big_url} rel="nofollow" target="_blank">
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
			</a>
		{/if}
	</ContextMenu.Trigger>
	<ContextMenu.Content class="min-w-48">
		<ContextMenu.CheckboxItem bind:checked={analysis}>Analysis</ContextMenu.CheckboxItem>
		<ContextMenu.Separator />
		<ContextMenu.Label>Settings</ContextMenu.Label>
		<ContextMenu.Item>
			<ContextMenuLabel>Opacity</ContextMenuLabel>
			<Slider
				value={[$settings.opacity]}
				onValueChange={(e) => ($settings.opacity = e[0])}
				min={0}
				max={100}
				step={1}
			/>
		</ContextMenu.Item>
		<ContextMenu.Item>
			<ContextMenuLabel>Mask Threshold</ContextMenuLabel>
			<Slider
				value={[$settings.mask_threshold]}
				onValueChange={(e) => (($settings.mask_threshold = e[0]), analyzeImage())}
				min={0.0}
				max={0.99}
				step={0.01}
			/>
		</ContextMenu.Item>
		<ContextMenu.Item>
			<ContextMenuLabel>Gaussian Radius</ContextMenuLabel>
			<Slider
				value={[$settings.gaussian_radius]}
				onValueChange={(e) => (($settings.gaussian_radius = e[0]), analyzeImage())}
				min={0}
				max={20}
				step={1}
			/>
		</ContextMenu.Item>
		<ContextMenu.Item>
			<ContextMenuLabel>Paint Alpha</ContextMenuLabel>
			<Slider
				value={[$settings.paint_alpha]}
				onValueChange={(e) => (($settings.paint_alpha = e[0]), analyzeImage())}
				min={0}
				max={2000}
				step={1}
			/>
		</ContextMenu.Item>
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
	</ContextMenu.Content>
</ContextMenu.Root>
