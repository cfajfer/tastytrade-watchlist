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
		watchlists
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
	class="mt-2"
	bind:value={selectedWatchlist}
	items={sortedWatchlistOptions}
	placeholder="Select Watchlist..."
/>
