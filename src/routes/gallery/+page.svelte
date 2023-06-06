<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col h-screen bg-slate-700">
	{#if data.charts != null}
		{#each data.charts as chart}
			<div class="flex">
				<a href="/editor/{chart.id}">{chart.name}</a>
			</div>
		{/each}
	{/if}
</div>
