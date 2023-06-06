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
	import StitchRenderer from '$lib/components/StitchRenderer.svelte';
	import ErrorOverlay from '$lib/components/ErrorOverlay.svelte';

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

	async function save(attempt = 0) {
		if (chart_renderer.chart == null) throw new Error('Chart is not set');

		const response = await fetch(`/editor/${chart_renderer.chart.id}/save`, {
			method: 'POST',
			body: JSON.stringify(chart_renderer.chart),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			data.err = {
				code: 500,
				message: `Could not save the chart, attempt ${attempt}/10`
			};

			if (attempt < 10) save(attempt + 1);
			console.error(response);
		}

		const response_data = await response.json();
		if (response_data.redirect != null) {
			goto(response_data.redirect);
		}
	}

	function set_chart_name(name: string) {
		if (chart_renderer.chart == undefined) return;

		chart_renderer.set_chart({
			...chart_renderer.chart,
			name
		});
	}
</script>

<div
	class="
		relative w-full h-full
		grid grid-cols-[1fr_70%_1fr] grid-rows-1"
>
	{#if data.err != null}
		<ErrorOverlay>
			<p class="text-red-700 font-bold text-center">{data.err.message}</p>
		</ErrorOverlay>
	{/if}

	<div class="bg-slate-700">
		<div
			class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 grid-rows-10 m-5"
		>
			{#each stitch_list as stitch}
				<div
					class:brightness-75={chart_renderer?.selected_stitch == stitch}
					class:hover:brightness-125={chart_renderer?.selected_stitch != stitch}
					class="flex items-center justify-center aspect-square bg-slate-300 border-radius-5 break-all p-1 rounded m-1"
				>
					<StitchRenderer
						{stitch}
						on:select={(event) => {
							chart_renderer.selected_stitch = stitch;
						}}
					/>
				</div>
			{/each}
		</div>
	</div>
	<div class="bg-slate-600 flex items-center justify-center">
		<div class="w-full h-full bg-slate-500" bind:this={konva_container} />
	</div>
	<div class="bg-slate-700 flex">
		<div class="m-2 flex flex-auto flex-col justify-center items-center">
			<!-- TODO: Find some style for rightmost editor panel -->
			<!-- TODO: Change the textarea to a div that opens up an editor when clicked on -->
			<textarea
				class="bg-transparent text-center w-max-full h-min w-full break-words resize-none"
				value={data.chart?.name}
				on:change|self={(event) => {
					// @ts-expect-error An error is expected here since |self is not recognized
					set_chart_name(event.target.value);
				}}
				on:keydown|self={(event) => {
					if (event.key === 'Enter') {
						// @ts-expect-error An error is expected here since |self is not recognized
						event.target.blur();
					}
				}}
			/>

			<button class="w-full bg-slate-300 rounded" on:click={() => save()}
				>SAVE</button
			>
		</div>
	</div>
</div>
