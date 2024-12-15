<script lang="ts">
	import type { TastytradeSearchSymbolResponse } from '$lib/server/symbolSearch.types';
	import { Modal, Button, Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let {
		watchlistSymbols = $bindable(),
		selectedWatchlist
	}: {
		watchlistSymbols: string[];
		selectedWatchlist: string;
	} = $props();

	let isModalOpen = $state<boolean>(false);
	let searchQuery = $state<string>('');
	let searchResults = $state<TastytradeSearchSymbolResponse['data']['items']>([]);
	let debounceTimeout: NodeJS.Timeout | null = null;

	onMount(() => {
		// Focus the input field and set the value of the input field to the key pressed
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key) {
				isModalOpen = true;
				const input = document.querySelector('input');
				if (input) {
					input.focus();
					searchQuery = event.key;
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	// Debounce function
	const debounce = (func: (...args: any[]) => void, delay: number) => {
		return (...args: any[]) => {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
			debounceTimeout = setTimeout(() => func(...args), delay);
		};
	};

	// Debounced search function
	const onSearch = debounce(async (query: string) => {
		if (query.trim() !== '') {
			searchResults = await fetch('/api/search?query=' + query).then((res) => res.json());
		} else {
			searchResults = [];
		}
	}, 250);

	// Add symbol to watchlist
	const addSymbolToWatchlist = async (symbol: string) => {
		await fetch('/api/watchlist', {
			method: 'POST',
			body: JSON.stringify({
				watchlistName: selectedWatchlist,
				watchlistSymbols,
				newSymbol: symbol
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		watchlistSymbols = [...watchlistSymbols, symbol];
	};

	// Handle modal close
	const handleModalClose = () => {
		isModalOpen = false;
		searchQuery = '';
		searchResults = [];
	};

	// Reset search results when modal is closed
	// Focus the input field when modal is opened
	$effect(() => {
		if (!isModalOpen) {
			handleModalClose();
		} else {
			const input = document.querySelector('input');
			if (input) {
				input.focus();
			}
		}
	});

	// Handle input changes
	const handleInputChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		onSearch(searchQuery);
	};

	// Handle symbol click
	const handleSymbolClick = async (symbol: string) => {
		await addSymbolToWatchlist(symbol);
		isModalOpen = false;
	};
</script>

<Button
	on:click={() => (isModalOpen = true)}
	class="flex h-10 items-center gap-2 rounded border border-blue-500 bg-transparent px-4 py-2 text-blue-500 transition duration-200 hover:bg-blue-500 hover:text-white"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="h-5 w-5"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg>Symbol
</Button>

<Modal bind:open={isModalOpen} title="Search for a Symbol" class="min-w-full">
	<div class="p-4">
		<!-- Search Input -->
		<Input
			id="search"
			type="text"
			placeholder="Type to search symbols..."
			bind:value={searchQuery}
			on:input={handleInputChange}
			class="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
		/>

		<!-- Search Results -->
		{#if searchResults.length > 0}
			<ul class="divide-y divide-gray-200 rounded-md bg-white shadow-md">
				{#each searchResults as result}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore event_directive_deprecated -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<li
						class="flex h-14 cursor-pointer items-center justify-between p-4 transition hover:bg-gray-100"
						on:click={() => handleSymbolClick(result.symbol)}
					>
						<div>
							<p class="font-medium text-gray-800">{result.symbol}</p>
							<p class="text-sm text-gray-500">{result.description}</p>
						</div>
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
						</svg>
					</li>
				{/each}
			</ul>
		{:else if searchQuery.trim() !== ''}
			<p class="mt-4 text-center text-gray-500">No results found.</p>
		{/if}
	</div>
</Modal>
