<script lang="ts">
	import { enhance } from '$app/forms';
	import { Label, Input, Button, Modal } from 'flowbite-svelte';

	let isModalOpen = $state<boolean>(false);
	let {
		selectedWatchlist = $bindable()
	}: {
		selectedWatchlist: string;
	} = $props();

	let watchlistName = $state('');

	const handleFormEnhance = () => {
		selectedWatchlist = watchlistName;
		isModalOpen = false;
		watchlistName = '';
	};
</script>

<div class="m-5 flex justify-center">
	<Button
		class="flex h-10 items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white shadow transition duration-200 hover:bg-blue-600"
		on:click={() => (isModalOpen = true)}
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
		</svg>Watchlist</Button
	>
</div>
<Modal title="Create Watchlist" bind:open={isModalOpen} class="min-w-full">
	<form method="POST" action="?/addWatchlist" use:enhance={handleFormEnhance}>
		<div class="mb-4 flex w-full items-center">
			<div class="flex w-full items-start gap-4">
				<div class="flex flex-grow flex-col">
					<Label for="name" class="mb-2 text-sm font-medium text-gray-700">Watchlist Name</Label>
					<Input
						name="name"
						type="text"
						id="name"
						placeholder="Type watchlist name..."
						bind:value={watchlistName}
						required
						class="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
					/>
				</div>
				<Button
					type="submit"
					class="h-10 flex-shrink-0 self-end rounded bg-blue-500 px-4 py-2 text-white shadow transition duration-200 hover:bg-blue-600"
				>
					<svg
						class="-ml-1 mr-1 h-6 w-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
							clip-rule="evenodd"
						/>
					</svg>
					Create Watchlist
				</Button>
			</div>
		</div>
	</form>
</Modal>
