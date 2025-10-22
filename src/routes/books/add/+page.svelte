<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { user, authInitialized } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let title = '';
	let author = '';
	let coverUrl = '';
	let status = 'want_to_read';
	let error = '';
	let loading = false;

    onMount(async () => {
        await waitForAuth();
    })
    async function waitForAuth() {
		// Check if auth is already initialized
		if ($authInitialized) {
			return;
		}
		
		// Wait for authentication to be initialized
		return new Promise<void>((resolve) => {
			const unsubscribe = authInitialized.subscribe((initialized) => {
				if (initialized) {
					unsubscribe();
					resolve();
				}
			});
		});
	}

	async function handleSubmit() {
        if (!$user) {
			console.error('User not authenticated');
			loading = false;
			return;
		}
		if (!title || !author) {
			error = 'Title and author are required';
			return;
		}

		error = '';
		loading = true;

		try {
			const { error: insertError } = await supabase.from('books').insert([
				{
					user_id: $user.id,
					title,
					author,
					cover_url: coverUrl || null,
					status
				}
			]);

			if (insertError) throw insertError;

			goto('/library');
		} catch (error) {
			console.error('Error adding book:', error)
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<h1>Add New Book</h1>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="title">Title *</label>
			<input id="title" type="text" bind:value={title} required placeholder="The Great Gatsby" />
		</div>

		<div class="form-group">
			<label for="author">Author *</label>
			<input
				id="author"
				type="text"
				bind:value={author}
				required
				placeholder="F. Scott Fitzgerald"
			/>
		</div>

		<div class="form-group">
			<label for="coverUrl">Cover Image URL (optional)</label>
			<input
				id="coverUrl"
				type="url"
				bind:value={coverUrl}
				placeholder="https://example.com/cover.jpg"
			/>
		</div>

		<div class="form-group">
			<label for="status">Reading Status</label>
			<select id="status" bind:value={status}>
				<option value="want_to_read">Want to Read</option>
				<option value="currently_reading">Currently Reading</option>
				<option value="finished">Finished</option>
			</select>
		</div>

		<div class="button-group">
			<button type="submit" disabled={loading}>
				{loading ? 'Adding...' : 'Add Book'}
			</button>
			<a href="/library" class="cancel-btn">Cancel</a>
		</div>
	</form>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 2rem;
		color: #333;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #555;
	}

	input,
	select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #667eea;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	button {
		flex: 1;
		padding: 0.75rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		background: #5568d3;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.cancel-btn {
		flex: 1;
		padding: 0.75rem;
		background: #f5f5f5;
		color: #666;
		border: 1px solid #ddd;
		border-radius: 4px;
		text-align: center;
		text-decoration: none;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cancel-btn:hover {
		background: #e0e0e0;
	}

	.error {
		background: #fee;
		color: #c33;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}
</style>
