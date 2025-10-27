<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth';
	import AccountModal from '$lib/components/AccountModal.svelte';
    import Button from '$lib/components/Button.svelte';

	let email = '';
	let password = '';
	let username = '';
	let error = '';
	let loading = false;

	onMount(() => {
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

<div class="container">
    <AccountModal type="signup">
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

			<div class="form-group">
				<Button variant="primary" disabled={loading}>
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
