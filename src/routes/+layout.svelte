<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';

	type NavLink = {
		url: string;
		name: string;
	};

	const nav_links: Array<NavLink> = [
		{
			url: '/gallery',
			name: 'Gallery'
		},
		{
			url: '/editor',
			name: 'Editor'
		}
	];
</script>

<div class="w-screen h-screen flex flex-col">
	<div class="w-screen bg-slate-900 text-slate-50 flex">
		<a
			href="/"
			class="flex p-2 px-4 items-center justify-center"
			class:bg-slate-950={$page.url.pathname == '/'}
			class:hover:bg-slate-800={$page.url.pathname != '/'}
		>
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src="/images/logo" class="mr-1" />Website Name
		</a>
		{#each nav_links as nav_link}
			<a
				href={nav_link.url}
				class="p-2 px-4"
				class:bg-slate-950={$page.url.pathname.startsWith(nav_link.url)}
				class:hover:bg-slate-800={!$page.url.pathname.startsWith(nav_link.url)}
				>{nav_link.name}</a
			>
		{/each}
	</div>

	<div class="w-screen h-full bg-slate-700">
		<slot />
	</div>
</div>
