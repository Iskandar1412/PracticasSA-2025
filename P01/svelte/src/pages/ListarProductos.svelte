<script>
    import Layout from "../components/Layout.svelte";
    import { onMount, tick } from "svelte";
    import TodoList from './subpages/TodoList.svelte';
    let disabledItems = [];
    let todoList;
    let productos = null;
    let isAdding = false;
    let isLoading = false;
    let error = null;

    onMount(async () => {
        loadTodos();
    });

    async function loadTodos() {
        isLoading = true;
        await fetch(`http://localhost:3200/productos`, {
            method: 'GET'
        })
        .then(async res => {
            if (res.ok) {
                productos = await res.json();
            } else {
                error = 'Error en la obtención de datos';
            }
        })
        isLoading = false;
    }


    async function handleRemoveTodo({title}) {
        if(disabledItems.includes(title)) return;
        disabledItems = [...disabledItems, title];
        await fetch(`http://localhost:3200/productos/quitar/${title}`, {
            method: 'DELETE'
        })
        .then(res => {
            if(res.ok) {
                productos = productos.filter((t) => t.p_nombre !== title)
            } else {
                alert('An error has ocurred')
            }
        })

        disabledItems = disabledItems.filter((item) => {
            item != title
        })
    }

    async function handleAddTodo({ p_nombre, p_cantidad, p_precio }) {
        event.preventDefault();
        isAdding = true;
        await fetch(`http://localhost:3200/productos/agregar`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                p_nombre: p_nombre,
                p_cantidad: p_cantidad,
                p_precio: p_precio,
            }),
        })
        .then(async res => {
            if (res.ok) {
                const todo = await res.json()
                productos = [{ p_nombre: p_nombre, p_cantidad: p_cantidad, p_precio: p_precio }, ...productos];
                todoList.clearInput();
            } else {
                alert('An error has ocurred')
            }
        })
        isAdding = false;
        await tick();
        todoList.focusInput();
    }
</script>

<Layout title="Lista de Productos">
    <div style:max-width="50vw" class="todoslist">
        <TodoList 
            {productos}
            {error}
            {isLoading}
            {disabledItems}
            disableAdding={isAdding}
            scrollOnAdd="top"
            bind:this={todoList}
            addtodo={handleAddTodo}
            removetodo={handleRemoveTodo}
        />
    </div>
</Layout>

<style lang="scss">
    .todoslist {
        margin: auto;
    }
</style>