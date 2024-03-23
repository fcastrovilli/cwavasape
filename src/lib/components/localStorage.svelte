<script lang="ts">
	import { browser } from '$app/environment';
	import { settings, updateLocalStorage } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		if (browser) {
			const storedSettings = localStorage.getItem('settings');
			if (!storedSettings) {
				updateLocalStorage('settings', $settings);
			} else {
				$settings = JSON.parse(storedSettings);
			}
		}
	});
</script>
