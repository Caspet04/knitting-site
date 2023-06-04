<script lang="ts">
	import type { PageServerData } from './$types';
	import { onMount } from 'svelte';
	import { Chart } from '$lib/chart';
	import { stitch_data_list, stitch_list, type StitchData } from '$lib/assets/stitches';

	export let data: PageServerData;
	let konva_container: HTMLDivElement;
	let chart: Chart;

	onMount(() => {
		chart = new Chart({
			container: konva_container,
			width: data.chart.width,
			height: data.chart.height
		});
	});
</script>

<div class="flex flex-col h-screen">
	<div class="px-2 w-full grid grid-cols-[1fr_auto_1fr] bg-slate-950 text-slate-50 text-lg">
		<div>Website Name</div>
		<div class="text-center">{data.chart.name}</div>
	</div>
	<div class="flex-1 w-full h-full flex">
		<div class="w-1/6 bg-slate-700">
			<div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 grid-rows-10 m-5">
				{#each stitch_list as stitch}
					{@const stitch_data = stitch_data_list[stitch]}
					<div
						class:brightness-75={chart?.selected_stitch == stitch}
						class:hover:brightness-125={chart?.selected_stitch != stitch}
						class="flex items-center justify-center aspect-square bg-slate-300 border-radius-5 break-all p-1 rounded m-1"
					>
						<!-- TODO: Add filled and empty, filled should maybe have a color identificator -->
						{#if stitch_data.type == 'image'}
							<img
								id="stitch-{stitch_data.identifier}"
								class="w-full h-full"
								alt={stitch_data.name}
								src={stitch_data.image}
								on:keydown={() => {}}
								on:click={() => {
									chart.selected_stitch = stitch;
								}}
							/>
						{:else if stitch_data.type == 'filled'}
							<div
								class="w-full h-full border border-black bg-stitch-{stitch_data.filled}"
								on:keydown={() => {}}
								on:click={() => {
									chart.selected_stitch = stitch;
								}}
							/>
						{:else}
							<div
								class="w-full h-full border border-black"
								on:keydown={() => {}}
								on:click={() => {
									chart.selected_stitch = stitch;
								}}
							/>
						{/if}
					</div>
				{/each}
			</div>
		</div>
		<!-- TODO: Fix the size of the scene -->
		<!-- IF it is smaller than the client view, create a centralized margin.
		     Otherwise, make the scene fit the view and make a virtual scene that is bigger. -->
		<div class="w-4/6 flex-auto bg-slate-600 flex items-center justify-center">
			<div class="w-full h-full bg-slate-500" bind:this={konva_container} />
		</div>
		<div class="w-1/6 bg-slate-700" />
	</div>
</div>
