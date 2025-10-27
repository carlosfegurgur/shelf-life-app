<script lang="ts">
	import type { Snippet } from "svelte";

	let { type, children }: { type: 'login' | 'signup', children: Snippet } = $props();

	type TextArray = {
		[key in 'login' | 'signup']: {
			strings: {
				title: string;
				subtitle: string;
				button: string;
				bottomText: string;
			}
		}
	};

	let textArray: TextArray = {
		'login': {
            strings: {
                "title": "Log in to your account",
                "subtitle": "Enter your email",
                "button": "Continue",
                "bottomText": "Don't have an account?"
            }
		},
		'signup': {
            strings: {
                "title": "Join Shelf Life for free",
                "subtitle": "Share and discover books with friends. Start with your email.",
                "button": "Create Account",
                "bottomText": "Already have an account?"
            }
		}
	};
</script>

<div class="modal-card">
	<div class="modal-header">
		<h1 class="title">
			{textArray[type].strings.title}
		</h1>
		<h3 class="subtitle">
			{textArray[type].strings.subtitle}
		</h3>
	</div>
	<div class="modal-form">
		{@render children()}
	</div>
	<div class="modal-bottom-text">
		{textArray[type].strings.bottomText} 
		{#if type === 'login'}
			<a class="modal-link" href="/signup">Create one for free</a>
		{:else}
			<a class="modal-link" href="/login">Log in</a>
		{/if}
	</div>
</div>

<style>
	.modal-card {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 36px;
        font-family: Arial, Helvetica, sans-serif;
	}

    .title {
        font-size: 48px;
    }

    .subtitle {
        font-size: 16px;
        font-weight: 400;
        color: var(--text-secondary);
    }

    .modal-link {
        text-decoration: none;
        color: var(--text-secondary)
    }

    @media only screen and (min-width: 48rem) {
        .modal-card {
            background-color: var(--bg-brand-secondary);
            border-radius: 16px;
        }
    }
</style>
