<script>
    import Layout from "../components/Layout.svelte";

    let nombre = "";
    let cantidad = 0;
    let precio = 0;

    const agregarProducto = async () => {
        const response = await fetch("http://localhost:3200/productos/agregar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    p_nombre: nombre,
                    p_cantidad: cantidad,
                    p_precio: precio,
                }),
            },
        );

        if (response.ok) {
            alert("Producto agregado exitosamente");
            location.reload();
        } else {
            alert("Error al agregar el producto");
        }
    };
</script>

<Layout title="Agregar Producto">
    <form on:submit|preventDefault={agregarProducto}>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" bind:value={nombre} required />

        <label for="cantidad">Cantidad:</label>
        <input type="number" id="cantidad" bind:value={cantidad} required />

        <label for="precio">Precio:</label>
        <input
            type="number"
            step="0.01"
            id="precio"
            bind:value={precio}
            required
        />

        <button type="submit">Agregar Producto</button>
    </form>
</Layout>

<style lang="scss">
    @use '../app.scss';
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        input {
            padding: 0.5rem;
            border: 1px solid app.$secondary-color;
            border-radius: 4px;
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
</style>
