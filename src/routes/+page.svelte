<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
    import RegisterPage from '$lib/components/RegisterPage.svelte';
    import UserPage from '$lib/components/UserPage.svelte';

	onMount(() => {
		// Redirect to login if not authenticated
		if (!$user) {
			goto('/');
		}
	});
</script>

{#if $user}
    <UserPage user={$user}/>
{:else}
	<RegisterPage />
{/if}