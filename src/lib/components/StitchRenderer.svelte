<script lang="ts">
	import {
		Stitch,
		stitch_data_list,
		type StitchData
	} from '$lib/assets/stitches';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ select: { stitch: Stitch } }>();

	export let stitch: Stitch;
	let stitch_data: StitchData;
	$: stitch_data = stitch_data_list[stitch];
</script>

{#if stitch_data.type == 'image'}
	<img
		class="w-full h-full"
		alt={stitch_data.name}
		src={stitch_data.image}
		on:keydown={() => {}}
		on:click={() => {
			dispatch('select', { stitch });
		}}
	/>
{:else if stitch_data.type == 'filled'}
	<div
		class="w-full h-full border border-black bg-stitch-{stitch_data.filled}"
		on:keydown={() => {}}
		on:click={() => {
			dispatch('select', { stitch });
		}}
	/>
{:else}
	<div
		class="w-full h-full border border-black"
		on:keydown={() => {}}
		on:click={() => {
			dispatch('select', { stitch });
		}}
	/>
{/if}
