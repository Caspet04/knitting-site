<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-4 h-full flex text-lg flex-col text-slate-100 overflow-y-auto">
	{#if data.charts != null}
		{#each data.charts as chart}
			<div class="flex hover:bg-slate-800">
				<a href="/editor/{chart.id}">{chart.name}</a>
			</div>
		{/each}
	{/if}
</div>
