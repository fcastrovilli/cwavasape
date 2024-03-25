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
				const storedSettingsObj = JSON.parse(storedSettings);
				const settingsObj = $settings;
				const keys = Object.keys(settingsObj);
				for (const key of keys) {
					if (typeof storedSettingsObj[key] === 'undefined') {
						console.warn(
							`Mismatching settings key "${key}" in localStorage. Using default settings.`
						);
						updateLocalStorage('settings', $settings);
						break;
					}
				}
				$settings = storedSettingsObj;
			}
		}
	});
</script>
