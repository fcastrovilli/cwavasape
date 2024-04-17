<script lang="ts">
	import { settings, scrollPosition } from '$lib/stores';
	import { onMount } from 'svelte';
	import * as Tone from 'tone';
	const meter = new Tone.Meter();
	let amplitude: number = -100;
	let mic: Tone.UserMedia;
	let fired = false;
	let input_devices = [];
	onMount(() => {
		mic = new Tone.UserMedia().connect(meter);
		select_input();
		// start_mic();
	});

	function select_input() {
		Tone.UserMedia.enumerateDevices().then((devices) => {
			input_devices = devices;
			console.log(input_devices);
			// console.log(devices.map((device) => device.label));
		});
	}

	function start_mic() {
		if (!mic) return;
		mic
			.open()
			.then(() => {
				// promise resolves when input is available
				console.log('mic open');
				// print the incoming mic levels in decibels
				mic.channelCount = 1;
				setInterval(
					() => ((amplitude = Number(meter.getValue())), calculate_threshold(amplitude)),
					100
				);
			})
			.catch((e) => {
				// promise is rejected when the user doesn't have or allow mic access
				console.log('mic not open');
			});
	}

	let last_reading: number = 0;
	function calculate_threshold(value: number) {
		if (value >= $settings.audio_threshold && !fired) {
			// console.log('FIRE');
			$scrollPosition = $scrollPosition + 1;
			fired = true;
			last_reading = value;
		} else if (
			(value < $settings.audio_threshold && fired) ||
			(value < last_reading - 5 && fired)
		) {
			// console.log('STOP');
			fired = false;
		}
	}
</script>

<div class="absolute left-0 top-0 z-50 text-3xl font-semibold text-white">
	<p>Amplitude: {amplitude.toFixed(2)}</p>
	<p>Threshold: {$settings.audio_threshold}</p>
</div>
