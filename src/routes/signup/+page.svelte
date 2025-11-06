<script lang="ts">
	import AccountModal from '$lib/components/AccountModal.svelte';
	import Button from '$lib/components/Button.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from '../$types';
	import { page } from '$app/state';

	let { data } = $props();

	let email = $state('');
	let password = $state('');
	let username = $state('');
	let error = $state('');
	let loading = $state(false);
	let usernameError = $state('');
	let checkingUsername = $state(false);
	let usernameAvailable = $state(); // null | true | false

	// Debounce timer
	let usernameCheckTimeout: any;

	// Check username availability
	function handleUsernameInput() {
		console.log('handling username input');
		usernameError = '';
		usernameAvailable = null;

		// Clear previous timeout
		clearTimeout(usernameCheckTimeout);

		// Don't check if too short
		if (username.length < 3) {
			usernameError = 'Username must be at least 3 characters';
			return;
		}

		// Check for valid characters
		if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
			usernameError = 'Username can only contain letters, numbers, hyphens, and underscores.';
			return;
		}

		// Debounce: wait 500ms after user stops typing
		usernameCheckTimeout = setTimeout(async () => {
			await checkUsernameAvailability();
		}, 500);
	}

	async function checkUsernameAvailability() {
		checkingUsername = true;

		try {
			const { data: existingUsers, error: availabilityError } = await data.supabase
				.from('users')
				.select('username')
				.eq('username', username)
				.limit(1);

			if (availabilityError) {
				console.error('Error with username', availabilityError);
				usernameError = 'Could not verify username availability.';
				usernameAvailable = null;
			} else if (existingUsers && existingUsers.length > 0) {
				usernameError = 'This username is already taken.';
				usernameAvailable = false;
			} else {
				usernameAvailable = true;
			}
		} catch (err) {
			console.error('Username check failed:', err);
			usernameError = 'Could not verify username availability.';
			usernameAvailable = null;
		} finally {
			checkingUsername = false;
		}
	}

	async function handleSignup() {
		if (usernameAvailable === false) {
			error = 'Please choose a different username';
			return;
		}

		try {
			loading = true;
			error = '';

			const { error: signUpError } = await data.supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username
					}
				}
			});

			if (signUpError) {
				// Show user-friendly error messages
				if (signUpError.message.includes('already registered')) {
					error = 'This email is already registered. Try logging in instead.';
				} else if (signUpError.message.includes('Password')) {
					error = 'Password must be at least 6 characters long.';
				} else if (signUpError.message.includes('unique')) {
					error = 'This username is already taken. Please choose another.';
				} else {
					error = signUpError.message;
				}
				return;
			}

			await invalidateAll();
			goto('/');
		} catch (err: any) {
			error = err.message || 'An unexpected error occurred. Please try again.';
			console.error('Signup error:', err);
		} finally {
			loading = false;
		}
	}
	// Derived state for button
	let canSubmit = $derived(
		email.length > 0 &&
			password.length >= 6 &&
			username.length >= 3 &&
			usernameAvailable === true &&
			!loading
	);
</script>

<div class="container">
	<AccountModal type="signup">
		{#if error}
			<div class="error" class:success={error.includes('Account created!')}>
				{error}
			</div>
		{/if}

		<form onsubmit={handleSignup}>
			<div class="form-group">
				<label for="username">Username</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					oninput={handleUsernameInput}
					required
					disabled={loading}
					minlength="3"
					placeholder="username"
				/>
				{#if checkingUsername}
					<small class="checking">Checking availability...</small>
				{:else if usernameError}
					<small class="error-text">{usernameError}</small>
				{:else if usernameAvailable === true}
					<small class="success-text">✓ Username available</small>
				{/if}
			</div>

			<div class="form-group">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					disabled={loading}
					placeholder="you@example.com"
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					disabled={loading}
					placeholder="••••••••"
					minlength="6"
				/>
			</div>

			<div class="form-group">
				<Button variant="primary" disabled={!canSubmit}>
					{loading ? 'Creating account...' : 'Sign up'}
				</Button>
			</div>
		</form>
	</AccountModal>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.form-group {
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
	}

	label {
		display: block;
		font-size: 14px;
		font-weight: 400;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	input {
		padding: 1rem;
		border-radius: 8px;
		border: none;
	}

	input:focus {
		outline: none;
		border-color: var(--bg-brand);
	}
	.error {
		background: #fee;
		color: #c33;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.error.success {
		background: #efe;
		color: #363;
	}
</style>
