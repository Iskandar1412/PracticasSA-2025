<script>
    import Layout from "../components/Layout.svelte";

    let ordenarPorPrecio = false;
    let ordenarPorCantidad = false;
    let productos = [];

    const ordenarProductos = async () => {
        const response = await fetch(
            `http://localhost:3200/productos/sortear?precio=${ordenarPorPrecio}&cantidad=${ordenarPorCantidad}`,
        );
        productos = await response.json();
    };
</script>

<Layout title="Ordenar Productos">
    <form on:submit|preventDefault={ordenarProductos}>
        <label>
            <input type="checkbox" bind:checked={ordenarPorPrecio} />
            Ordenar por Precio
        </label>
        <label>
            <input type="checkbox" bind:checked={ordenarPorCantidad} />
            Ordenar por Cantidad
        </label>
        <button type="submit">Ordenar</button>
    </form>

    {#if productos.length > 0}
        <ul>
            {#each productos as producto}
                <li>
                    <strong>{producto.p_nombre}</strong> - Cantidad: {producto.p_cantidad},
                    Precio: ${producto.p_precio}
                </li>
            {/each}
        </ul>
    {:else}
        <p>No hay productos disponibles.</p>
    {/if}
</Layout>

<style lang="scss">
    @use '../app.scss';
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        button {
            padding: 0.5rem;
            background-color: app.$primary-color;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;

        }
    }

    ul {
        list-style: none;
        padding: 0;

        li {
            padding: 0.5rem;
            background-color: #fff;
            border: 1px solid app.$secondary-color;
            border-radius: 4px;
            margin-bottom: 0.5rem;
        }
    }
</style>
