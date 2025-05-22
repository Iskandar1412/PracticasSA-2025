<script>
  import { Route, Router } from "svelte-routing";
  import { onMount } from "svelte";
  import { isAuthenticated, user } from "./stores/auth.store";
  import Login from "./lib/pages/Login.svelte";
  import Register from "./lib/pages/Register.svelte";
  import { handleAuthAndNavigation, setCurrentPage } from "./stores/page.store";
  import Base from "./lib/pages/Base.svelte";
  import Home from "./lib/pages/global/Home.svelte";

  onMount(() => {
    isAuthenticated.subscribe(auth => {
      console.log("User authenticated:", auth);
      if(!auth) {
        setCurrentPage('/');
      }
      handleAuthAndNavigation();
    });
  });
</script>

<Router>
  <Route path="/"><Login /></Route>
  <Route path="/register"><Register /></Route>
  <Route path="/home">
    <Base Component={Home} />
  </Route>
  
</Router>