<script>
    import { handleAuthAndNavigation, setCurrentPage } from "../../../stores/page.store";
    import { isAuthenticated, logoutUser, user } from "../../../stores/auth.store";
    import { sidebarOpen } from "../../../stores/store.sidevar";
    import { darkMode } from "../../../stores/store.dark";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";
    
    onMount(() => {
        if($isAuthenticated === false) {
            logoutUser()
            setCurrentPage('/');
            navigate('/');
        }
        handleAuthAndNavigation();
    });
</script>

<svelte:head>
    <title>{$user.usuario.toUpperCase()} Dashboard</title>
</svelte:head>

<main class="content" class:full-width={$sidebarOpen} class:dark-mode={$darkMode}>
    <h1>Bienvenido <b>{$user.nombres} {$user.apellidos}</b> - Rol: <b>{$user.rol}</b></h1>
</main>

<style lang="scss">
    .content {
        flex-grow: 1;
        padding: 20px;
        transition: all 0.3s ease-in-out;
    }

    .content.full-width {
        width: 100%;
    }
</style>