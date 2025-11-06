<script lang="ts">
	import RegisterPage from '$lib/components/RegisterPage.svelte';
	import UserPage from '$lib/components/UserPage.svelte';

	let { data } = $props();	
	let { user, userProfile } = $derived(data)
</script>

{#if user}
	<UserPage {user} {userProfile} />
{:else}
	<RegisterPage />
{/if}