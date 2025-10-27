<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth';
	import AccountModal from '$lib/components/AccountModal.svelte';
	import Button from '$lib/components/Button.svelte';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	onMount(() => {
		if ($user) {
			goto('/');
		}
	});

	async function handleLogin() {
		error = '';
		loading = true;

		try {
			const { error: loginError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (loginError) {
				// Handle specific error messages
				if (loginError.message.includes('Invalid login credentials')) {
					error = 'Invalid email or password. Please try again.';
				} else if (loginError.message.includes('Email not confirmed')) {
					error = 'Please check your email and click the confirmation link before logging in.';
				} else {
					error = loginError.message;
				}
				return;
			}

			goto('/');
		} catch (err) {
			console.error('Error with logging in:', err);
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

		<form on:submit|preventDefault={handleLogin}>
			<div class="form-group">
				<label for="email">Email</label>
				<input id="email" type="email" bind:value={email} required placeholder="you@example.com" />
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
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
