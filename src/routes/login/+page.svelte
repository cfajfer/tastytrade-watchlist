<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let username = $state<string>('');
	let password = $state<string>('');

	let isFormValid = $derived<boolean>(username.length > 0 && password.length > 0);
</script>

<main
	id="mainBody"
	class="w-full flex-1 overflow-y-auto bg-white px-2 text-gray-800 lg:px-20 lg:py-14"
>
	<div class="w-3/12 sm:w-full md:w-full">
		<div class="text-lg font-bold">Sign In to tastytrade</div>
		<form method="POST" action="?/login" use:enhance>
			<div class="max-w-lg">
				<div class="my-3">
					<div>Username or Email</div>
					<input
						name="username"
						type="text"
						bind:value={username}
						class="w-full border border-gray-400 p-2"
					/>
				</div>
				<div class="my-3">
					<div>Password</div>
					<input
						name="password"
						type="password"
						bind:value={password}
						class="w-full border border-gray-400 p-2"
					/>
				</div>
				<button
					type="submit"
					formaction="?/login"
					disabled={!isFormValid}
					class="my-3 w-full cursor-pointer rounded bg-black p-5 text-white opacity-100 shadow transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50
					{isFormValid ? 'bg-green-400  hover:bg-green-500' : ''}"
				>
					SIGN IN
				</button>
			</div>
		</form>
		{#if form?.message}
			<div class="mt-1 text-lg text-red-800">{form.message}</div>
		{/if}
	</div>
</main>
