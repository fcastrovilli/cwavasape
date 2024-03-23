<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	export let label: string = 'Setting';
	export let settings_value: number = 0;
	export let unity: string = '%';
</script>

<div class="flex items-center justify-between">
	<Label>{label}</Label>
	<span>
		{settings_value}{unity}
	</span>
</div>
<slot />
