<script lang="ts">
  let { data } = $props();
  let { userProfile } = $derived(data);

</script>

<div class="container">
	<h1>Dashboard</h1>
	<p>HELLO! {userProfile?.username}</p>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>
