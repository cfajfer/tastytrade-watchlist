<script lang="ts">
	import type { TastytradeGetWatchlistResponse, WatchlistData } from '$lib/server/watchlist.types';
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
		page = $bindable(),
		selectedSymbol = $bindable(),
		selectedWatchlist,
		watchlistData
	}: {
		watchlistSymbols: string[];
		page: 'watchlist' | 'chart';
		selectedSymbol: string;
		selectedWatchlist: string;
		watchlistData: WatchlistData;
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
		selectedSymbol = symbol;
		page = 'chart';
	};

	const onDeleteSymbol = async (symbol: string) => {
		await deleteSymbolFromWatchlist(symbol);
		watchlistSymbols = watchlistSymbols.filter((wlSymbol) => wlSymbol !== symbol);
	};
</script>

<div class="mb-3 max-h-[50vh] overflow-y-auto rounded-md border border-gray-200">
	<Table class="w-full">
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
				{#each watchlistSymbols as symbol}
					<TableBodyRow
						class="group h-10 cursor-pointer text-sm hover:bg-gray-100"
						onclick={() => onClickRow(symbol)}
					>
						<TableBodyCell>{symbol}</TableBodyCell>
						<TableBodyCell>{watchlistData[symbol]?.bid ?? '-'}</TableBodyCell>
						<TableBodyCell>{watchlistData[symbol]?.ask ?? '-'}</TableBodyCell>
						<TableBodyCell>{watchlistData[symbol]?.last ?? '-'}</TableBodyCell>
						<TableBodyCell>
							<button
								onclick={(event) => {
									event.stopPropagation();
									onDeleteSymbol(symbol);
								}}
								aria-label="Delete symbol"
								type="button"
								class="invisible translate-y-[.25rem] text-red-500 transition duration-200 hover:text-red-900 group-hover:visible"
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
					<TableBodyCell colspan={5} class="p-0 text-center">
						<div class="flex h-full items-center justify-center px-2 py-5">
							Add symbols to get started
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
		</TableBody>
	</Table>
</div>
