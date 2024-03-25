<script lang="ts">
	import '../app.pcss';
	import LocalStorage from '$lib/components/localStorage.svelte';
	import Start from '$lib/components/start.svelte';
	import { started } from '$lib/stores';
</script>

<LocalStorage />
{#if $started}
	<slot />
{:else}
	<Start />
{/if}
