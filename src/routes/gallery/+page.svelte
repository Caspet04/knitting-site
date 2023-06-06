<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<!-- BUG: Fix viewing bug -->
<!-- TODO: Add login widget -->
<!-- TODO: Add login api -->
<!-- NOTE: If it is possible to use fetch or otherwise login without reload page, that would preferable in the editor -->
<!-- TODO: Create a front page -->
<div>
	{#if data.private_charts != null}
		<h1>Private</h1>
		<div
			class="p-4 h-full flex text-lg flex-col text-slate-100 overflow-y-auto"
		>
			{#each data.private_charts as chart}
				<div class="flex hover:bg-slate-800">
					<a href="/editor/{chart.id}">{chart.name}</a>
				</div>
			{/each}
		</div>
	{/if}

	{#if data.public_charts != null}
		<h1>Public</h1>
		<div
			class="p-4 h-full flex text-lg flex-col text-slate-100 overflow-y-auto"
		>
			{#each data.public_charts as chart}
				<div class="flex hover:bg-slate-800">
					<a href="/editor/{chart.id}">{chart.name}</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
