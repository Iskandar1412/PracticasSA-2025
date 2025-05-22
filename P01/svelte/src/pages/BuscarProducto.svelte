<script>
    import Layout from "../components/Layout.svelte";

    let nombre = "";
    let producto = null;
    let error = "";

    const buscarProducto = async () => {
        error = "";
        const response = await fetch(
            `http://localhost:3200/productos/buscar/${nombre}`,
        );
        if (response.ok) {
            producto = await response.json();
        } else {
            producto = null;
            error = "Producto no encontrado.";
        }
    };
</script>

<Layout title="Buscar Producto">
    <form on:submit|preventDefault={buscarProducto}>
        <label for="nombre">Producto:</label>
        <input type="text" id="nombre" bind:value={nombre} required />
        <button type="submit">Buscar</button>
    </form>

    {#if error}
        <p class="error">{error}</p>
    {:else if producto}
        <div class="producto">
            <h3>{producto.p_nombre}</h3>
            <p>Cantidad: {producto.p_cantidad}</p>
            <p>Precio: ${producto.p_precio}</p>
        </div>
    {/if}
</Layout>

<style lang="scss">
    @use "../app.scss" as *;

    .navbar {
        background-color: $primary-color;
        color: white;
        padding: 1rem 0;

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
                    a {
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
