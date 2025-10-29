<script lang="ts">
	let {
		href,
		variant,
		disabled,
		onclick,
		children
	}: {
		href?: string;
		variant: string;
		disabled?: boolean;
		onclick?: () => void;
		children: any;
	} = $props();
</script>

{#if href}
	<a {href} class="btn btn-{variant}">
		{@render children()}
	</a>
{:else}
	<button class="btn btn-{variant}" {disabled} {onclick}>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 16px;
		text-decoration: none;
		font-family: Arial, Helvetica, sans-serif;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.btn-primary {
		background-color: var(--bg-brand);
		color: var(--bg-secondary);
	}

	.btn-primary:hover {
		background-color: var(--bg-brand-hover);
	}

	.btn-secondary {
		background-color: var(--bg-brand-secondary);
		color: var(--text);
	}

	.btn-secondary:hover {
		background-color: var(--bg-brand-secondary-hover);
	}

	.btn-tertiary {
		background-color: var(--bg-brand-tertiary);
		color: var(--text);
	}

	.btn-tertiary:hover {
		background-color: var(--bg-brand-tertiary-hover);
	}
</style>
