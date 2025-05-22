<script>
    import { fade } from "svelte/transition";
    import Fa500Px  from 'svelte-icons/fa/FaGithub.svelte';
    import Day  from 'svelte-icons/fa/FaFirstOrder.svelte';
    import Night  from 'svelte-icons/fa/FaFirstOrderAlt.svelte';
    import { darkMode } from "../../../stores/store.dark";
    import { logoutUser, user } from "../../../stores/auth.store";
    import { writable } from "svelte/store";
    import { sidebarOpen } from "../../../stores/store.sidevar";
    import { setCurrentPage } from "../../../stores/page.store";
    import { navigate } from "svelte-routing";
  import { pathBackend } from "../../../stores/host";
    
    const toggleSidebar = () => {
        sidebarOpen.update((open) => !open);
    }

    const toggleDarkMode = () => {
        darkMode.update((dark) => !dark);
    }
    
    let userMenuOpen = writable(false);

    function toggleUserMenu() {
        userMenuOpen.update(value => !value);
    }

    function logout() {
        fetch(`${pathBackend}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) throw new Error('Error logout');
            return res.json();
        })
        .then(data => {
            console.log(data);
            if(data.success) {
                logoutUser();
                setCurrentPage('/');
                navigate('/');
            } else {
                throw new Error('Error desconocido');
            }
        })
        .catch((e) => {
            alert(e);
        })
    }
</script>

<header class="top-bar" class:dark-mode={$darkMode}>
    <button class="menu-toggle" onclick={toggleSidebar}>☰</button>
    <input type="text" placeholder="Search..." class="search-bar" />

    <div class="user-menu-container">
        {#if $user}
        <span class="user-name">{$user.nombres}</span>
        {/if}
        <button class="user-icon" onclick={toggleUserMenu}>
            <Fa500Px />
        </button>
        <button class="mode-toggle" onclick={toggleDarkMode}>
            {#if $darkMode}
                <Night size="15" />
            {:else}
                <Day size="15" />
            {/if}
        </button>

        {#if $userMenuOpen}
            <div class="user-dropdown" in:fade out:fade>
                <button onclick={logout}>Cerrar sesión</button>
            </div>
        {/if}
    </div>
</header>

<style>
    .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 5vh;
        padding: 10px 20px;
        background-color: #e5e7eb;
        color: cornflowerblue;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s;
        :global(svg) {
            width: 30px;
            color: cornflowerblue;
        }
    }

    .dark-mode {
        background-color: #1f2937;
    }

    .menu-toggle {
        font-size: 20px;
        cursor: pointer;
        background: none;
        border: none;
        color: inherit;
    }

    .search-bar {
        flex-grow: 1;
        margin: 0 15px;
        padding: 5px 10px;
        border-radius: 5px;
        border: none;
        color: cornflowerblue;
    }

    .user-menu-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .user-name {
        font-weight: 500;
    }

    .mode-toggle,
    .user-icon {
        font-size: 18px;
        cursor: pointer;
        background: none;
        border: none;
        color: inherit;
    }

    .user-dropdown {
        position: absolute;
        right: 20px;
        top: 50px;
        background: white;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        overflow: hidden;
        z-index: 10;
        display: flex;
        flex-direction: column;
    }

    .dark-mode .user-dropdown {
        background: #1f2937;
        color: white;
    }

    .user-dropdown button {
        padding: 10px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        width: 100%;
        color: inherit;
    }

    .user-dropdown button:hover {
        background: #f3f4f6;
    }

    .dark-mode .user-dropdown button:hover {
        background: #374151;
    }
</style>