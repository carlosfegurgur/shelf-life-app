<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { user, authInitialized } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let name = '';
	let description = '';
	let color = '#667eea';
	let error = '';
	let loading = false;

	onMount(async () => {
		await waitForAuth();
	});

	async function waitForAuth() {
		if ($authInitialized) {
			return;
		}
		
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

		if (!name.trim()) {
			error = 'Bookshelf name is required';
			return;
		}

		error = '';
		loading = true;

		try {
			const { error: insertError } = await supabase.from('bookshelves').insert([
				{
					user_id: $user.id,
					name: name.trim(),
					description: description.trim() || null,
				}
			]);

			if (insertError) throw insertError;

			goto('/bookshelves');
		} catch (err: any) {
			console.error('Error creating bookshelf:', err);
			error = err.message || 'Failed to create bookshelf';
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<div class="header">
		<h1>Create New Bookshelf</h1>
		<a href="/bookshelves" class="back-btn">← Back to Bookshelves</a>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="bookshelf-form">
		<div class="form-group">
			<label for="name">Bookshelf Name *</label>
			<input 
				id="name" 
				type="text" 
				bind:value={name} 
				required 
				placeholder="e.g., Fantasy Novels, Work Reading, etc."
				disabled={loading}
			/>
		</div>

		<div class="form-group">
			<label for="description">Description</label>
			<textarea 
				id="description" 
				bind:value={description} 
				placeholder="Optional description for this bookshelf..."
				rows="3"
				disabled={loading}
			></textarea>
		</div>

		<div class="form-actions">
			<button type="button" class="cancel-btn" on:click={() => goto('/bookshelves')} disabled={loading}>
				Cancel
			</button>
			<button type="submit" class="submit-btn" disabled={loading || !name.trim()}>
				{loading ? 'Creating...' : 'Create Bookshelf'}
			</button>
		</div>
	</form>

	<div class="preview">
		<h3>Preview</h3>
		<div class="bookshelf-preview" style="--shelf-color: {color}">
			<div class="preview-header">
				<h4>{name || 'Bookshelf Name'}</h4>
				{#if description}
					<p>{description}</p>
				{/if}
			</div>
			<div class="preview-footer">
				<span class="preview-count">0 books</span>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		color: #333;
		margin: 0;
	}

	.back-btn {
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.back-btn:hover {
		color: #5a6fd8;
	}

	.error {
		background: #fee;
		color: #c33;
		padding: 1rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		border: 1px solid #fcc;
	}

	.bookshelf-form {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #333;
	}

	input, textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	input:focus, textarea:focus {
		outline: none;
		border-color: #667eea;
	}

	input:disabled, textarea:disabled {
		background: #f5f5f5;
		color: #999;
	}

	.color-picker {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.color-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.color-option:hover {
		border-color: #ccc;
		background: #f9f9f9;
	}

	.color-option input[type="radio"] {
		width: auto;
		margin: 0;
	}

	.color-option input[type="radio"]:checked + .color-circle {
		transform: scale(1.2);
		box-shadow: 0 0 0 2px white, 0 0 0 4px var(--color);
	}

	.color-circle {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		transition: transform 0.2s;
	}

	.color-name {
		font-size: 0.9rem;
		color: #666;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	.cancel-btn {
		background: none;
		border: 2px solid #e0e0e0;
		color: #666;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
	}

	.cancel-btn:hover:not(:disabled) {
		border-color: #ccc;
		background: #f5f5f5;
	}

	.submit-btn {
		background: #667eea;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.submit-btn:hover:not(:disabled) {
		background: #5a6fd8;
	}

	.submit-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.preview {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.preview h3 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.bookshelf-preview {
		border: 2px solid var(--shelf-color);
		border-radius: 8px;
		overflow: hidden;
		background: white;
	}

	.preview-header {
		background: linear-gradient(135deg, var(--shelf-color), color-mix(in srgb, var(--shelf-color) 80%, white));
		color: white;
		padding: 1rem;
	}

	.preview-header h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
	}

	.preview-header p {
		margin: 0;
		opacity: 0.9;
		font-size: 0.9rem;
	}

	.preview-footer {
		padding: 1rem;
		background: #f9f9f9;
	}

	.preview-count {
		color: #666;
		font-size: 0.9rem;
		font-weight: 500;
	}
</style>
