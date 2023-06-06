<script lang="ts">
	import type { PageServerData } from './$types';
	import { onMount } from 'svelte';
	import { ChartRenderer } from '$lib/chart';
	import {
		stitch_data_list,
		stitch_list,
		type StitchData
	} from '$lib/assets/stitches';
	import { goto } from '$app/navigation';

	export let data: PageServerData;
	let konva_container: HTMLDivElement;
	const chart_renderer = new ChartRenderer();

	$: {
		(() => {
			if (data.err) return;
			chart_renderer.set_chart(data.chart);
		})();
	}

	onMount(async () => {
		if (data.err) return;

		chart_renderer.set_chart(data.chart);
		chart_renderer.set_container(konva_container);
	});

	async function save() {
		if (chart_renderer.chart == null) throw new Error('Chart is not set');

		const response = await fetch(`/editor/${chart_renderer.chart.id}/save`, {
			method: 'POST',
			body: JSON.stringify(chart_renderer.chart),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			// TODO: Handle the error better
			console.error(response);
		}

		const response_data = await response.json();
		if (response_data.redirect != null) {
			goto(response_data.redirect);
		}
	}
</script>

{#if data.chart == null}
	<div
		class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center"
	>
		<div
			class="w-1/2 h-1/4 bg-slate-100 rounded-xl flex justify-center items center flex-col"
		>
			<p class="text-red-700 font-bold text-center">Chart does not exist</p>
			<a class="text-center" href="/gallary">Return to gallary</a>
		</div>
	</div>
{/if}

<div class="flex flex-col h-screen">
	<div
		class="px-2 w-full grid grid-cols-[1fr_auto_1fr] bg-slate-950 text-slate-50 text-lg"
	>
		<div>Website Name</div>
		<div class="text-center">{data.chart?.name}</div>
	</div>
	<div class="flex-1 w-full h-full flex">
		<div class="w-1/6 bg-slate-700">
			<div
				class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 grid-rows-10 m-5"
			>
				{#each stitch_list as stitch}
					{@const stitch_data = stitch_data_list[stitch]}
					<div
						class:brightness-75={chart_renderer?.selected_stitch == stitch}
						class:hover:brightness-125={chart_renderer?.selected_stitch !=
							stitch}
						class="flex items-center justify-center aspect-square bg-slate-300 border-radius-5 break-all p-1 rounded m-1"
					>
						{#if stitch_data.type == 'image'}
							<img
								id="stitch-{stitch_data.identifier}"
								class="w-full h-full"
								alt={stitch_data.name}
								src={stitch_data.image}
								on:keydown={() => {}}
								on:click={() => {
									chart_renderer.selected_stitch = stitch;
								}}
							/>
						{:else if stitch_data.type == 'filled'}
							<div
								class="w-full h-full border border-black bg-stitch-{stitch_data.filled}"
								on:keydown={() => {}}
								on:click={() => {
									chart_renderer.selected_stitch = stitch;
								}}
							/>
						{:else}
							<div
								class="w-full h-full border border-black"
								on:keydown={() => {}}
								on:click={() => {
									chart_renderer.selected_stitch = stitch;
								}}
							/>
						{/if}
					</div>
				{/each}
			</div>
		</div>
		<div class="w-4/6 flex-auto bg-slate-600 flex items-center justify-center">
			<div class="w-full h-full bg-slate-500" bind:this={konva_container} />
		</div>
		<div class="w-1/6 bg-slate-700 flex justify-center items-center">
			<button on:click={() => save()}>SAVE</button>
		</div>
	</div>
</div>
