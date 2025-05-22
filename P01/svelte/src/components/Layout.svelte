<script>
    import Navbar from "./Navbar.svelte";

    export let title = "Practica 1";
</script>

<Navbar />
<main class="container">
    <h2>{title}</h2>
    <slot />
</main>

<style lang="scss">
    main {
        margin-top: 2rem;
    }
</style>
