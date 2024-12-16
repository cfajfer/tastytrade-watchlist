<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import WatchlistGrid from '$lib/components/watchlist/WatchlistGrid.svelte';
	import WatchlistSelect from '$lib/components/watchlist/WatchlistSelect.svelte';
	import AddWatchlist from '$lib/components/watchlist/AddWatchlist.svelte';
	import SymbolSearch from '$lib/components/search/SymbolSearch.svelte';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import WatchlistWebsocket from '$lib/components/websocket/watchlistWebsocket.svelte';
	import ChartWebsocket from '$lib/components/websocket/chartWebsocket.svelte';
	import type { WatchlistData } from '$lib/server/watchlist.types';

	let selectedWatchlist: string = $state('');
	let watchlistSymbols: string[] = $state([]);
	let watchlistData: WatchlistData = $state({});
	let selectedSymbol: string = $state('');
	let page: 'watchlist' | 'chart' = $state('watchlist');
	let { data }: { data: PageServerData } = $props();
</script>

<header class="flex items-center justify-between bg-gray-50 p-4 text-black">
	<h1 class="text-lg font-bold">My Watchlists</h1>
	<form method="post" action="?/logout" use:enhance>
		<Button
			class="flex h-8 items-center gap-2 rounded bg-gray-500 px-4 py-2 text-white shadow transition duration-200 hover:bg-gray-600"
			>{data.user}<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-5 w-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</Button>
		<Dropdown>
			<DropdownItem>
				<button class="w-full text-left" type="submit">Logout</button></DropdownItem
			>
		</Dropdown>
	</form>
</header>

<div class="p-6">
	{#if page === 'watchlist'}
		<div class="mb-6 flex items-center justify-between">
			<WatchlistSelect bind:selectedWatchlist watchlists={data.watchlists} />
			<AddWatchlist bind:selectedWatchlist />
		</div>
		<WatchlistGrid
			bind:watchlistSymbols
			bind:page
			bind:selectedSymbol
			{watchlistData}
			{selectedWatchlist}
		/>
		<SymbolSearch bind:watchlistSymbols {selectedWatchlist} />
		<WatchlistWebsocket bind:watchlistData {watchlistSymbols} token={data.token} />
	{/if}
	{#if page === 'chart'}
		<ChartWebsocket bind:page bind:selectedSymbol token={data.token} />
	{/if}
</div>
