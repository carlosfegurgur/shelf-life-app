<script>
    import Button from "./Button.svelte";
</script>

<div class="container">
	<h1 class="title">Share your reads. Discover new favorites.</h1>
    <p class="subtitle">Keep a simple bookshelf of books you own, read, or want to read. Follow friends and see their shelves. It's free.</p>
	<div class="btn-container">
        <Button href="/signup" variant="primary">Create free account</Button>
        <Button href="/login" variant="secondary">Log in</Button>
    </div>
</div>

<style>
    .container {
        max-width: var(--max-width);
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
        height: 50vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    .title {
        font-size: var(--header-size);
    }

    .subtitle {
        font-size: 20px;
        color: var(--text-secondary);
        font-family: Arial, Helvetica, sans-serif;
    }

    .btn-container {
        margin-top: 2rem;
        display: flex;
        gap: 2rem;
    }

    @media only screen and (min-width: 48rem){
        .title {
            font-size: var(--header-size-lg);
        }
    }

</style>
