<script lang="ts">
	import type { TastytradeGetAllWatchlistResponse } from '$lib/server/watchlist.types';
	import { Modal, Button } from 'flowbite-svelte';

	let {
		watchlists = $bindable(),
		selectedWatchlist = $bindable()
	}: {
		watchlists: TastytradeGetAllWatchlistResponse;
		selectedWatchlist: string;
	} = $props();

	let isModalOpen = $state<boolean>(false);

	// Delete watchlist
	const deleteWatchlist = async (watchlistToDelete: string) => {
		await fetch('/api/watchlist?query=' + watchlistToDelete, {
			method: 'DELETE',
			body: JSON.stringify({}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};

	// Handle modal close
	const handleModalClose = () => {
		isModalOpen = false;
	};

	// Handle click confirm
	const handleDeleteWatchlist = async (watchlistToDelete: string) => {
		await deleteWatchlist(watchlistToDelete);
		watchlists = watchlists.filter(({ name }) => name !== watchlistToDelete);
		selectedWatchlist = '';
		handleModalClose();
	};
</script>

<div class="m-5 flex justify-center">
	<Button
		type="button"
		disabled={!selectedWatchlist}
		onclick={() => {
			isModalOpen = true;
		}}
		aria-label="Delete Watchlist"
		class="flex h-10 bg-transparent hover:bg-transparent disabled:opacity-50"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class={`h-10 w-10 text-gray-500 transition duration-200 `}
		>
			<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z" />
		</svg>
	</Button>
</div>
<Modal title="Delete Watchlist" bind:open={isModalOpen} class="min-w-full">
	<div class="flex flex-col items-center justify-center gap-4 p-6">
		<p class="text-center text-lg font-semibold text-gray-800">
			Are you sure you want to delete this watchlist?
		</p>
		<Button
			type="submit"
			class="flex items-center justify-center gap-2 rounded bg-red-500 px-6 py-3 text-white shadow transition duration-200 hover:bg-red-600"
			onclick={() => handleDeleteWatchlist(selectedWatchlist)}
		>
			<svg
				class="h-6 w-6"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"
				/>
			</svg>
			Delete Watchlist
		</Button>
	</div>
</Modal>
