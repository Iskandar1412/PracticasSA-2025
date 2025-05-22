<script>
    import { Link } from "svelte-routing";
</script>

<nav class="navbar">
    <div class="container">
        <h1 class="logo">Practica 1</h1>
        <ul class="nav-links">
            <li><Link to="/">Listar Productos</Link></li>
            <!-- <li><Link to="/agregar">Agregar Producto</Link></li> -->
            <li><Link to="/buscar">Buscar Producto</Link></li>
            <li><Link to="/ordenar">Ordenar Productos</Link></li>
        </ul>
    </div>
</nav>

<style lang="scss">
    @use '../app.scss';
    .navbar {
        background-color: app.$primary-color;
        color: white;
        padding: 0 0;

        .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .logo {
                font-size: 1.5rem;
                font-weight: bold;
            }

            .nav-links {
                list-style: none;
                display: flex;
                gap: 1rem;
    
                li {
                    :global(a) {
                        color: white;
                        text-decoration: none;
                        font-weight: bold;
    
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }
</style>
