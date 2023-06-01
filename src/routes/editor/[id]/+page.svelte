<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<div class="flex flex-col h-screen">
	<div class="px-2 w-full grid grid-cols-[1fr_auto_1fr] bg-slate-950 text-slate-50 text-lg">
		<div>Website Name</div>
		<div class="text-center">Pattern Name {data.id}</div>
	</div>
	<div class="flex-1 w-full h-full flex">
		<div class="w-1/6 bg-slate-700">
			<div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 grid-rows-10 m-5">
				{#each Array(10) as _}
					<div
						class="flex items-center justify-center aspect-square bg-slate-300 border-radius-5 break-all p-1 rounded m-1 hover:brightness-125"
					>
						<img alt="TEMPAAAAA" />
					</div>
				{/each}
			</div>
		</div>
		<div class="flex-auto bg-slate-50 flex">
			<canvas class="flex-auto m-10 bg-slate-500" style="width=100%" />
		</div>
		<div class="w-1/6 bg-slate-700" />
	</div>
</div>
