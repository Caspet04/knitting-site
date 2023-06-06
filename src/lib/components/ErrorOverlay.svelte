<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ disappear: undefined }>();
</script>

<div
	class="
z-50
absolute inset-0
bg-black bg-opacity-50
flex justify-center items-center"
>
	<div
		class="
relative
w-1/2 h-1/4
bg-slate-100 rounded-xl
flex justify-center items-center flex-col"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span
			class="
            absolute right-0 top-0
            m-2
            cursor-pointer
            material-symbols-outlined"
			on:click={() => dispatch('disappear', undefined)}>close</span
		>
		<slot />
	</div>
</div>
