<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth';

	let email = '';
	let password = '';
	let username = '';
	let error = '';
	let loading = false;

	onMount(() => {
		// Redirect if already authenticated
		if ($user) {
			goto('/');
		}
	});

	async function handleSignup() {
		error = '';
		loading = true;

		try {
			// Sign up user
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password
			});

			if (signUpError) {
				// Handle specific error messages
				if (signUpError.message.includes('User already registered')) {
					error = 'An account with this email already exists. Please try logging in instead.';
				} else if (signUpError.message.includes('Password should be at least')) {
					error = 'Password must be at least 6 characters long.';
				} else if (signUpError.message.includes('Invalid email')) {
					error = 'Please enter a valid email address.';
				} else {
					error = signUpError.message;
				}
				return;
			}

			// Create profile
			if (data.user) {
				const { error: profileError } = await supabase.from('profiles').insert([
					{
						id: data.user.id,
						username,
						email
					}
				]);

				if (profileError) {
					error = 'Account created but profile setup failed. Please contact support.';
					return;
				}
			}

			// Show success message for email confirmation
			if (data.user && !data.session) {
				error =
					'Account created! Please check your email to confirm your account before logging in.';
				return;
			}

			goto('/');
		} catch (err) {
			console.error('Error signing up:', err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="auth-container">
	<div class="auth-card">
		<h1>Sign Up for Shelf Life</h1>

		{#if error}
			<div class="error" class:success={error.includes('Account created!')}>{error}</div>
		{/if}

		<form on:submit|preventDefault={handleSignup}>
			<div class="form-group">
				<label for="username">Username</label>
				<input id="username" type="text" bind:value={username} required placeholder="johndoe" />
			</div>

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
					minlength="6"
				/>
			</div>

			<button type="submit" disabled={loading}>
				{loading ? 'Creating account...' : 'Sign Up'}
			</button>
		</form>

		<p class="auth-link">
			Already have an account? <a href="/login">Log in</a>
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

	.error.success {
		background: #efe;
		color: #363;
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
