<script lang="ts">
	export let label: string = 'Setting';
	export let settings_value: number = 0;
	export let unity: string = '%';
</script>

<div class="flex justify-between">
	<h4>{label}</h4>
	<span class="inline">
		{settings_value}{unity}
	</span>
</div>
<slot />
