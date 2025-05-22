<script>
    import { writable } from "svelte/store";
    import { sidebarOpen } from "../../../../stores/store.sidevar";
    import Configuration from 'svelte-icons/fa/FaCogs.svelte';
    import { slide } from "svelte/transition";
    import { darkMode } from "../../../../stores/store.dark";

    let activeMenu = writable(null);

    function toggleMenu(section) {
        activeMenu.update(current => (current === section ? null : section));
    }
</script>


<div class="menu-section" class:dark-mode={$darkMode}>
    <button class="menu-title" onclick={() => toggleMenu("settings")}>
        <Configuration /> &nbsp; Configuración
    </button>
    {#if $activeMenu === "settings" && !($sidebarOpen)}
        <ul class="menu-list" in:slide={{ duration: 200 }} out:slide={{ duration: 200 }}>
            <li><a href="/settings">Preferencias</a></li>
            <li><a href="/security">Seguridad</a></li>
        </ul>
    {/if}
</div>

<style lang="scss">
    .menu-title {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        display: flex;
        font-size: 16px;
        padding: 10px;
        cursor: pointer;
        color: black;
        :global(svg) {
            width: 25px;
        }
    }

    .dark-mode .menu-title {
        color: white;
    }

    .menu-title:hover {
        background-color: #d1d5db;
    }

    .dark-mode .menu-title:hover {
        background-color: #374151;
    }

    .menu-list {
        list-style: none;
        padding: 0;
        margin-left: 15px;
        overflow: hidden;
    }

    .menu-list li {
        margin: 5px 0;
    }

    .menu-list li a {
        text-decoration: none;
        color: black;
        font-size: 14px;
        padding: 8px;
        display: block;
        border-radius: 5px;
    }

    .dark-mode .menu-list li a {
        color: white;
    }

    .menu-list li a:hover {
        background-color: #d1d5db;
    }

    .dark-mode .menu-list li a:hover {
        background-color: #374151;
    }

    .menu-section {
        margin-bottom: 10px;
    }

    @media (max-width: 768px) {
        .sidebar {
            position: absolute;
            height: 95vh;
            z-index: 100;
            width: 250px;
        }
    }
</style>