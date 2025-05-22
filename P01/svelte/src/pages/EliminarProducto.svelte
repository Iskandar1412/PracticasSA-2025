<script>
    import Layout from "../components/Layout.svelte";

    let nombre = "";

    const eliminarProducto = async () => {
        const response = await fetch(
            `http://localhost:3200/productos/quitar/${nombre}`,
            {
                method: "DELETE",
            },
        );

        if (response.ok) {
            alert("Producto eliminado exitosamente");
        } else {
            alert("Producto no encontrado");
        }
    };
</script>

<Layout title="Eliminar Producto">
    <form on:submit|preventDefault={eliminarProducto}>
        <label for="nombre">Producto:</label>
        <input type="text" id="nombre" bind:value={nombre} required />
        <button type="submit">Eliminar</button>
    </form>
</Layout>
