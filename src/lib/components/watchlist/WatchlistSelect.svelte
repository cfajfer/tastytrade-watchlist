<script lang="ts">
	import type { TastytradeGetAllWatchlistResponse } from '$lib/server/watchlist.types';
	import { Select } from 'flowbite-svelte';

	let {
		watchlists,
		selectedWatchlist = $bindable()
	}: {
		watchlists: TastytradeGetAllWatchlistResponse;
		selectedWatchlist?: string;
	} = $props();

	const sortedWatchlistOptions = $derived(
		[...watchlists]
			.sort((a, b) => a['order-index'] - b['order-index'])
			.map((watchlist) => {
				return {
					value: watchlist.name,
					name: watchlist.name
				};
			})
	);

	// if there is nothing selected, select the first watchlist
	$effect(() => {
		if (sortedWatchlistOptions.length > 0 && !selectedWatchlist)
			selectedWatchlist = sortedWatchlistOptions[0].value;
	});
</script>

<Select
	class="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
	bind:value={selectedWatchlist}
	items={sortedWatchlistOptions}
	placeholder="Select Watchlist..."
/>
