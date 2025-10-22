<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';
	import { user, authInitialized } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	interface Bookshelf {
		id: string;
		name: string;
		description?: string;
		color?: string;
		user_id: string;
		created_at: string;
		updated_at?: string;
	}

	let bookshelf: Bookshelf | null = null;
	let loading = true;
	let saving = false;
	let error = '';

	let form = {
		name: '',
		description: '',
		color: '#667eea'
	};

	$: bookshelfId = $page.params.id;

	const colorOptions = [
		{ value: '#667eea', name: 'Blue' },
		{ value: '#f093fb', name: 'Pink' },
		{ value: '#4facfe', name: 'Light Blue' },
		{ value: '#43e97b', name: 'Green' },
		{ value: '#fa709a', name: 'Coral' },
		{ value: '#ffecd2', name: 'Peach' },
		{ value: '#a8edea', name: 'Mint' },
		{ value: '#d299c2', name: 'Purple' },
		{ value: '#fad0c4', name: 'Rose' },
		{ value: '#ff9a9e', name: 'Salmon' }
	];

	onMount(async () => {
		await waitForAuth();
		await fetchBookshelf();
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

	async function fetchBookshelf() {
		if (!bookshelfId || !$user) {
			error = 'Bookshelf not found or user not authenticated';
			loading = false;
			return;
		}

		loading = true;
		const { data, error: fetchError } = await supabase
			.from('bookshelves')
			.select('*')
			.eq('id', bookshelfId)
			.eq('user_id', $user.id)
			.single();

		if (fetchError) {
			error = 'Bookshelf not found or access denied';
			console.error('Error fetching bookshelf:', fetchError);
		} else {
			bookshelf = data;
			// Populate form
			if (bookshelf) {
				form = {
					name: bookshelf.name,
					description: bookshelf.description || '',
					color: bookshelf.color || '#667eea'
				};
			}
		}
		loading = false;
	}

	async function handleSubmit() {
		if (!bookshelf || !$user) return;

		if (!form.name.trim()) {
			error = 'Bookshelf name is required';
			return;
		}

		error = '';
		saving = true;

		try {
			const { error: updateError } = await supabase
				.from('bookshelves')
				.update({
					name: form.name.trim(),
					description: form.description.trim() || null,
					color: form.color,
					updated_at: new Date().toISOString()
				})
				.eq('id', bookshelf.id)
				.eq('user_id', $user.id);

			if (updateError) throw updateError;

			goto(`/bookshelves/${bookshelf.id}`);
		} catch (err: any) {
			error = err.message || 'Failed to update bookshelf';
			console.error('Error updating bookshelf:', err);
		} finally {
			saving = false;
		}
	}

	async function deleteBookshelf() {
		if (!bookshelf || !$user) return;

		if (!confirm('Are you sure you want to delete this bookshelf? All books in this shelf will be moved to "No Shelf". This action cannot be undone.')) {
			return;
		}

		try {
			// First, remove bookshelf_id from all books in this shelf
			const { error: updateBooksError } = await supabase
				.from('books')
				.update({ bookshelf_id: null })
				.eq('bookshelf_id', bookshelf.id)
				.eq('user_id', $user.id);

			if (updateBooksError) {
				console.error('Error updating books:', updateBooksError);
			}

			// Then delete the bookshelf
			const { error: deleteError } = await supabase
				.from('bookshelves')
				.delete()
				.eq('id', bookshelf.id)
				.eq('user_id', $user.id);

			if (deleteError) throw deleteError;

			goto('/bookshelves');
		} catch (err: any) {
			error = err.message || 'Failed to delete bookshelf';
			console.error('Error deleting bookshelf:', err);
		}
	}
</script>

<div class="container">
	<div class="header">
		<h1>Edit Bookshelf</h1>
		<a href="/bookshelves/{bookshelfId}" class="back-btn">← Back to Bookshelf</a>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	{#if loading}
		<p class="loading">Loading bookshelf...</p>
	{:else if bookshelf}
		<form on:submit|preventDefault={handleSubmit} class="bookshelf-form">
			<div class="form-group">
				<label for="name">Bookshelf Name *</label>
				<input 
					id="name" 
					type="text" 
					bind:value={form.name} 
					required 
					placeholder="e.g., Fantasy Novels, Work Reading, etc."
					disabled={saving}
				/>
			</div>

			<div class="form-group">
				<label for="description">Description</label>
				<textarea 
					id="description" 
					bind:value={form.description} 
					placeholder="Optional description for this bookshelf..."
					rows="3"
					disabled={saving}
				></textarea>
			</div>

			<div class="form-group">
				<label>Color Theme</label>
				<div class="color-picker">
					{#each colorOptions as option}
						<label class="color-option" style="--color: {option.value}">
							<input 
								type="radio" 
								bind:group={form.color} 
								value={option.value}
								disabled={saving}
							/>
							<span class="color-circle" style="background: {option.value}"></span>
							<span class="color-name">{option.name}</span>
						</label>
					{/each}
				</div>
			</div>

			<div class="form-actions">
				<button type="button" class="delete-btn" on:click={deleteBookshelf} disabled={saving}>
					Delete Bookshelf
				</button>
				<div class="form-actions-right">
					<button type="button" class="cancel-btn" on:click={() => goto(`/bookshelves/${bookshelfId}`)} disabled={saving}>
						Cancel
					</button>
					<button type="submit" class="submit-btn" disabled={saving || !form.name.trim()}>
						{saving ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>
		</form>

		<div class="preview">
			<h3>Preview</h3>
			<div class="bookshelf-preview" style="--shelf-color: {form.color}">
				<div class="preview-header">
					<h4>{form.name || 'Bookshelf Name'}</h4>
					{#if form.description}
						<p>{form.description}</p>
					{/if}
				</div>
				<div class="preview-footer">
					<span class="preview-count">Books in this shelf</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="error">
			<h2>Bookshelf not found</h2>
			<p>The bookshelf you're trying to edit doesn't exist or you don't have access to it.</p>
			<a href="/bookshelves" class="back-link">← Back to Bookshelves</a>
		</div>
	{/if}
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

	.error h2 {
		margin: 0 0 0.5rem 0;
	}

	.error p {
		margin: 0 0 1rem 0;
	}

	.back-link {
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
	}

	.loading {
		text-align: center;
		color: #666;
		font-size: 1.1rem;
		padding: 3rem;
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
		justify-content: space-between;
		align-items: center;
		margin-top: 2rem;
	}

	.form-actions-right {
		display: flex;
		gap: 1rem;
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

	.delete-btn {
		background: #e74c3c;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.delete-btn:hover:not(:disabled) {
		background: #c0392b;
	}

	.delete-btn:disabled {
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
