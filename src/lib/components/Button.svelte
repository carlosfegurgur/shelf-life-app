<script lang="ts">
	let {
		href,
		variant,
        disabled,
		children
	}: {
		href?: string;
		variant: string;
        disabled?: boolean;
		children: any;
	} = $props();
</script>

{#if href}
	<a {href} class="btn btn-{variant}">
		{@render children()}
	</a>
{:else}
	<button class="btn btn-{variant}">
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		padding: 1rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 16px;
		text-decoration: none;
		font-family: Arial, Helvetica, sans-serif;
	}

	.btn-primary {
		background-color: var(--bg-brand);
		color: var(--bg-brand-secondary);
	}

	.btn-primary:hover {
		background-color: var(--bg-brand-hover);
	}

	.btn-secondary {
		background-color: var(--bg-brand-secondary);
		color: var(--bg-brand);
	}

	.btn-secondary:hover {
		background-color: var(--bg-brand-secondary-hover);
	}
</style>
