<script>
  import { Router, Route } from "svelte-routing";
  import ListarProductos from "./pages/ListarProductos.svelte";
  // import AgregarProducto from "./pages/AgregarProducto.svelte";
  // import EliminarProducto from "./pages/EliminarProducto.svelte";
  import BuscarProducto from "./pages/BuscarProducto.svelte";
  import OrdenarProductos from "./pages/OrdenarProductos.svelte";
</script>

<Router>
  <Route path="/" component={ListarProductos} />
  <!-- <Route path="/agregar" component={AgregarProducto} /> -->
  <!-- <Route path="/eliminar" component={EliminarProducto} /> -->
  <Route path="/buscar" component={BuscarProducto} />
  <Route path="/ordenar" component={OrdenarProductos} />
</Router>
