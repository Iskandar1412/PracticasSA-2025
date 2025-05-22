<script>
    import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';
    import { scale } from 'svelte/transition';
    import Button from '../../components/Button.svelte';
    import  { flip } from 'svelte/animate';
    
    let {
        addtodo,
        removetodo,
        productos = null,
        error = null,
        isLoading = false,
        disableAdding = false,
        scrollOnAdd = undefined,
        disabledItems = [],
    } = $props()

    let inputText = $state('');
    let input = $state();
    let inputPrecio = $state();
    let inputP = $state();
    let inputCantidad = $state();
    let inputC = $state();
    let listDiv = $state();
    let listDivScrollHeight = $state();
    let autoScroll = $state();
    let prevTodos = productos;
    let todo = $state();

    $effect(() => {
        todo = productos ? productos.filter((t) => t) : []
    })

    $effect(() => {
        autoScroll = productos && prevTodos && productos.length > prevTodos.length
        prevTodos = productos
    })

    export function clearInput() {
        inputText = '';
        inputCantidad = null;
        inputPrecio = null;
    }

    export function focusInput() {
        input.focus();
    }

    $effect(() => {
        productos && productos.length
        if(scrollOnAdd) {
            let pos;
            if(scrollOnAdd === 'top') pos = 0;
            if(scrollOnAdd === 'bottom') pos = listDivScrollHeight;
            if(autoScroll) listDiv.scrollTo(0, pos)
            autoScroll = false
        }
    })

    function handleAddTodo(event) {
        event.preventDefault();
        addtodo({ p_nombre: inputText, p_cantidad: inputCantidad, p_precio: inputPrecio })
    }
    
    function handleRemoveTodo(id) {
        removetodo({ title: id })
    }

</script>

<div class="todo-list-wrapper">
    {#if isLoading}
        <p class="state-text">Loading...</p>
    {:else if error}
        <p class="state-text">{error}</p>    
    {:else if productos}
        <div
            class="todo-list"
            bind:this={listDiv}
        >
            <div bind:offsetHeight={listDivScrollHeight}>
                {#if productos.length === 0}
                    <p class="state-text">No todos yet</p>
                {:else}
                    <div style:display="flex">
                        {#each [todo] as list, index}
                            <div class="list-wrapper">
                                <ul>
                                    {#each list as todo, index (todo.p_nombre) }
                                        {@const {p_nombre, p_cantidad, p_precio} = todo}
                                        <li animate:flip={{duration: 300}}>
                                            <div
                                                transition:scale|local={{start: 0.5, duration: 300}}
                                            >
                                                <div class="product-info">
                                                    <span class="left">{p_nombre}</span>
                                                    <span class="center">Cantidad: {p_cantidad}</span>
                                                    <span class="right">$: {p_precio}</span>
                                                </div>
                                                <button 
                                                    disabled={disabledItems.includes(p_nombre)}
                                                    class="remove-todo-button"
                                                    aria-label="Remove todo: {p_nombre}"
                                                    onclick={() => handleRemoveTodo(p_nombre)}
                                                >
                                                    <span
                                                        style:width="20px"
                                                        style:display="inline-block"
                                                    >
                                                        <FaRegTrashAlt />
                                                    </span>
                                                </button>
                                            </div>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
    <form 
        class="add-todo-form"
        onsubmit={handleAddTodo}
    >
        <input 
            class="clase-primera"
            disabled={disableAdding || !productos}
            bind:this={input}
            bind:value={inputText}
            placeholder="Nuevo Producto"
        />
        <input 
            class="clase-segunda"
            disabled={disableAdding || !productos}
            bind:this={inputC}
            bind:value={inputCantidad}
            type="number"
            placeholder="Cantidad"
        />
        <input 
            class="clase-segunda"
            disabled={disableAdding || !productos}
            bind:this={inputP}
            bind:value={inputPrecio}
            type="decimal"
            placeholder="Precio"
        />
        <Button
            class="add-todo-button"
            type="submit"
            disabled={!inputText || disableAdding || !productos || !inputCantidad || inputCantidad <= 0 || !inputPrecio || inputPrecio <= 0}
        >
            Add
        </Button>
    </form>
</div>

<style lang="scss">
    .todo-list-wrapper {
        background-color: #424242;
        border: 1px solid #4b4b4b;
        .state-text {
            margin: 0;
            padding: 15px;
            text-align: center;
            color: antiquewhite;
        }
        .todo-list {
            max-height: 40vh;
            overflow: auto;
            .list-wrapper {
                padding: 10px;
                flex: 1;
                h2: {
                    margin: 0 0 10px;
                }
                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    li > div {
                        margin-bottom: 5px;
                        display: flex;
                        align-items: center;
                        background-color: #303030;
                        border-radius: 5px;
                        padding: 10px;
                        position: relative;
                        .product-info {
                            cursor: pointer;
                            font-size: 18px;
                            display: flex;
                            align-items: baseline;
                            padding-right: 20px;
                            justify-content: space-between;
                            color: #fff;
                            .left {
                                width: 250px;
                            }

                            .center {
                                width: 170px;
                            }

                            .right {
                                width: 100px;
                            }
                        }
                        .remove-todo-button {
                            border: none;
                            background: none;
                            padding: 5px;
                            position: absolute;
                            right: 10px;
                            cursor: pointer;
                            display: none;
                            &:disabled {
                                opacity: 0.4;
                                cursor: not-allowed;
                            }
                            :global(svg) {
                                fill: #bd1414;
                            }
                        }
                        &:hover {
                            .remove-todo-button {
                                display: block;
                            }
                        }
                    }
                }
            }
        }
        .add-todo-form {
            padding: 15px;
            background-color: #303030;
            display: flex;
            flex-wrap: wrap;
            border-top: 1px solid #4b4b4b;
            :global(.add-todo-button) {
                background-color: aqua;
            }
            .clase-primera {
                flex: 1;
                background-color: #424242;
                border: 1px solid #4b4b4b;
                padding: 10px;
                width: 150px;
                color: #fff;
                border-radius: 5px;
                margin-right: 10px;
            }
            .clase-segunda {
                flex: 2;
                background-color: #424242;
                border: 1px solid #4b4b4b;
                padding: 10px;
                width: 30px;
                color: #fff;
                border-radius: 5px;
                margin-right: 10px;
            }
        }
    }
</style>