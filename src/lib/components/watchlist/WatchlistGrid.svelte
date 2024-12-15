<script lang="ts">
	import type { TastytradeGetWatchlistResponse } from '$lib/server/watchlist.types';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	let {
		watchlistSymbols = $bindable(),
		selectedWatchlist
	}: {
		watchlistSymbols: string[];
		selectedWatchlist: string;
	} = $props();

	const fetchWatchlistSymbols = async (watchlistName = '') => {
		const watchlistData = (await fetch(`/api/watchlist?query=${watchlistName}`).then((res) =>
			res.json()
		)) as TastytradeGetWatchlistResponse;
		return watchlistData['watchlist-entries'] || [];
	};

	const deleteSymbolFromWatchlist = async (symbol: string) => {
		await fetch(`/api/watchlist?query=${selectedWatchlist}`, {
			body: JSON.stringify({ symbolToDelete: symbol, watchlistSymbols }),
			method: 'DELETE'
		});
	};

	$effect(() => {
		const getWatchlistSymbols = async () => {
			const watchlistSymbolsArr = await fetchWatchlistSymbols(selectedWatchlist);
			watchlistSymbols = watchlistSymbolsArr.map(({ symbol }) => symbol);
		};

		getWatchlistSymbols();
	});

	const onClickRow = (symbol: string) => {
		// do something
	};

	const onDeleteSymbol = async (symbol: string) => {
		await deleteSymbolFromWatchlist(symbol);
		watchlistSymbols = watchlistSymbols.filter((wlSymbol) => wlSymbol !== symbol);
	};
</script>

<Table class="mb-3 max-h-[50vh] overflow-y-auto rounded-md border border-gray-200">
	<TableHead>
		<TableHeadCell>Symbol</TableHeadCell>
		<TableHeadCell>Bid</TableHeadCell>
		<TableHeadCell>Ask</TableHeadCell>
		<TableHeadCell>Last</TableHeadCell>
		<TableHeadCell></TableHeadCell>
		<!-- Unlabeled column -->
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#if watchlistSymbols.length > 0}
			{#each watchlistSymbols as item, i}
				<TableBodyRow
					class="group h-10 text-sm hover:bg-gray-100"
					on:click={() => onClickRow(item)}
				>
					<TableBodyCell>{item}</TableBodyCell>
					<TableBodyCell>{(Math.random() * 100).toFixed(2)}</TableBodyCell>
					<TableBodyCell>{(Math.random() * 100).toFixed(2)}</TableBodyCell>
					<TableBodyCell>{(Math.random() * 100).toFixed(2)}</TableBodyCell>
					<TableBodyCell>
						<button
							onclick={() => {
								onDeleteSymbol(item);
							}}
							aria-label="Delete symbol"
							type="button"
							class="invisible translate-y-[.25rem] text-red-500 transition duration-200 hover:text-red-600 group-hover:visible"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-5 w-5"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		{:else}
			<TableBodyRow>
				<TableBodyCell colspan={5} class="p-0">
					<div class="px-2 py-3">Add symbols to get started</div>
				</TableBodyCell>
			</TableBodyRow>
		{/if}
	</TableBody>
</Table>
