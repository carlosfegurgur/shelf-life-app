<script lang="ts">
	import AccountModal from '$lib/components/AccountModal.svelte';
	import Button from '$lib/components/Button.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleLogin() {
		try {
			loading = true;
			error = '';
			
			const { error: loginError } = await data.supabase.auth.signInWithPassword({
				email,
				password
			});

			if (loginError) {
				// Show user-friendly error message
				if (loginError.message.includes('Invalid login credentials')) {
					error = 'Invalid email or password. Please try again.';
				} else if (loginError.message.includes('Email not confirmed')) {
					error = 'Please confirm your email address before logging in.';
				} else {
					error = loginError.message;
				}
				return; // Don't redirect on error
			}
			await invalidateAll();
			goto('/');
		} catch (err: any) {
			error = err.message || 'An unexpected error occurred. Please try again.';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<AccountModal type="login">
		{#if error}
			<div class="error">{error}</div>
		{/if}

		<form onsubmit={handleLogin}>
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
				/>
			</div>

			<div class="form-group">
				<Button variant="primary" disabled={loading}>
					{loading ? 'Logging in...' : 'Log In'}
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
</style>
