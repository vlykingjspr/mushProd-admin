<script lang="ts">
	import { authHandlers } from '../stores/Authstore';

	let email = '';
	let password = '';
	let confirmPass = '';
	let error = false;
	let register = false;
	let authenticating = false;

	async function handleAuthenticate() {
		if (authenticating) {
			return;
		}
		if (!email || !password || (register && !confirmPass)) {
			error = true;
			return;
		}

		authenticating = true;

		try {
			if (!register) {
				await authHandlers.login(email, password);
			} else {
				await authHandlers.signup(email, password);
			}
		} catch (err) {
			console.log('There was an auth error', err);
			error = true;
		}
	}
	function handleRegister() {
		register = !register;
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';
	let date: any;
	let quantity: any;
	let remarks: string;
</script>

<div class="authContainer">
	<form action="">
		<header class={cHeader}>
			<div class="flex items-center justify-center">Log in to Mush Prod</div>
		</header>

		{#if error}
			<p class="error">The Information you have enter is not correct</p>
		{/if}
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<input type="email" placeholder="Email" bind:value={email} />
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<input type="password" placeholder="Password" bind:value={password} />
		</div>

		{#if register}
			<label>
				<p class={confirmPass ? 'above' : 'center'}>Confirm Password</p>

				<input bind:value={confirmPass} type="password" placeholder="Confirm Password" />
			</label>
		{/if}

		<button
			on:click={handleAuthenticate}
			type="button"
			class="btn btn-md variant-filled-primary mr-2"
		>
			{#if authenticating}
				<i class="fa-solid fa-spinner spin" />
			{:else}
				Login
			{/if}
		</button>
	</form>
	<div class="option">
		<p>Or</p>
		{#if register}
			<div>
				<p>Already have an account</p>
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<p on:click={handleRegister} on:keydown={() => {}}>Login</p>
			</div>
		{:else}
			<div>
				<p>Don't have an account</p>
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<p on:click={handleRegister} on:keydown={() => {}}>Register</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.authContainer {
		display: flex;
		flex-direction: column;
		align-items: center; /* Center horizontally */
		justify-content: center; /* Center vertically */
		flex: 1;
		padding: 24px;
		height: 100vh; /* Take up the full viewport height */
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	form,
	.option {
		width: 400px;
		max-width: 100%;
		margin: 0 auto;
	}
	.spin {
		animation: spin 2s infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	form label {
		position: relative;
		border: 1px solid navy;
		border-radius: 5px;
	}

	form input {
		width: 100%;
		border: none;
		background: transparent;
		color: white;
		padding: 8px 14px;
	}
	form input:focus {
		border: none;
		outline: none;
	}
	form label:focus-within {
		border-color: blue;
	}

	.above,
	.center {
		position: absolute;
		transform: translateY(-50%);
		pointer-events: none;
		color: white;
		border-radius: 4px;
		padding: 0 6px;
		font-size: 0.8rem;
	}

	.above {
		top: 0;
		left: 24px;
		background: navy;
		border: 1px solid blue;
		font-size: 0.7rem;
	}
	.center {
		top: 50%;
		left: 6px;
		border: 1px solid transparent;
		opacity: 0;
	}
	.error {
		color: coral;
		font-size: 0.9rem;
		text-align: center;
	}
	.option {
		padding: 14px 0;
		overflow: hidden;
		font-size: 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.option > p {
		position: relative;
		text-align: center;
		width: fit-content;
		margin: 0 auto;
		padding: 0 8px;
	}
	.option > p::after,
	.option > p::before {
		position: absolute;
		content: '';
		top: 50%;
		transform: translateY(-50%);
		width: 100vh;
		height: 1.5px;
		background: white;
	}

	.option > p::after {
		right: 100%;
	}
	.option > p::before {
		left: 100%;
	}
	.option div {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.option div p:last-of-type {
		color: cyan;
		cursor: pointer;
	}
</style>
