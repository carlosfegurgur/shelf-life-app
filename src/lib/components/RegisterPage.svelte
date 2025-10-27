<script>
    function openSignupModal() {
        window.alert('sign up!');
    }
    function openLoginModal() {
        window.alert('log in!');
    }
</script>

<div class="container">
	<h1 class="title">Share your reads. Discover new favorites.</h1>
    <p class="subtitle">Keep a simple bookshelf of books you own, read, or want to read. Follow friends and see their shelves. It's free.</p>
	<div class="btn-container">
        <a href="/signup" class="btn btn-primary">Create free account</a>
        <a href="/login" class="btn btn-secondary">Log in</a>
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

    @media only screen and (min-width: 48rem){
        .title {
            font-size: var(--header-size-lg);
        }
    }

</style>
