<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	onMount(() => {
		// Redirect if already authenticated
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
			// error = err.message || 'An unexpected error occurred. Please try again.';
            console.error('Error with logging in:', err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="auth-container">
	<div class="auth-card">
		<h1>Welcome Back</h1>

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

			<button type="submit" disabled={loading}>
				{loading ? 'Logging in...' : 'Log In'}
			</button>
		</form>

		<p class="auth-link">
			Don't have an account? <a href="/signup">Sign up</a>
		</p>
	</div>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.auth-card {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		margin-bottom: 1.5rem;
		color: #333;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #555;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #667eea;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		margin-top: 1rem;
	}

	button:hover:not(:disabled) {
		background: #5568d3;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error {
		background: #fee;
		color: #c33;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.auth-link {
		text-align: center;
		margin-top: 1rem;
		color: #666;
	}

	.auth-link a {
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
	}
</style>
