<script>
  import { onMount } from "svelte";
  let { Component } = $props();

  import { isAuthenticated, logoutUser, user } from "../../stores/auth.store";
  import Sidebar from "./attributes/Sidebar.svelte";
  import Topbar from "./attributes/Topbar.svelte";
  import { sidebarOpen } from "../../stores/store.sidevar";
  import { navigate } from "svelte-routing";
  import { handleAuthAndNavigation, setCurrentPage } from "../../stores/page.store";
  import { darkMode } from "../../stores/store.dark";
  
  onMount(() => {
      if($isAuthenticated === false) {
          logoutUser()
          setCurrentPage('/');
          navigate('/');
      }
      handleAuthAndNavigation();
  });

  onMount(() => {
    console.log($isAuthenticated);
    console.log($user);
  });
</script>

{#if $isAuthenticated && $user}
  <div class="dashboard" class:dark-mode={$darkMode}>
    <Topbar />
    
    <div class="dashboard-container">
      <Sidebar />
      
      <Component />
    </div>
  </div>
{/if}
  
<style lang="scss">
  .dashboard {
      display: flex;
      flex-direction: column;
      height: 100vh;
      transition: background-color 0.3s ease;
  }

  .dark-mode {
      background-color: #111827;
      color: white;
  }
  
  .dashboard-container {
      display: flex;
      flex-grow: 1;
      height: 95vh;
      transition: all 0.3s ease-in-out;
  }
</style>