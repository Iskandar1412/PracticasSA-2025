<script>
    import { onMount, tick } from "svelte";
    import { Link, navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { isAuthenticated } from "../../stores/auth.store";
    import { handleAuthAndNavigation, setCurrentPage } from "../../stores/page.store";
    import { pathBackend } from "../../stores/host";

    let step = 1;
    let formData = {
        names: "",
        last: "",
        years: 0,
        user: "",
        email: "",
        pass: "",
    };

    onMount(() => {
        isAuthenticated.subscribe(auth => {
            console.log("User authenticated:", auth);
            handleAuthAndNavigation();
        });
    })

    let showToast = false;
    let toastMessage = "";

    // Mensajes de errores
    function showError(message) {
        toastMessage = message;
        showToast = true;

        setTimeout(() => {
            showToast = false;
        }, 3000);
    }

    // Función opciones formulario
    async function nextStep() {
        if (step === 1 && (!formData.names || !formData.last)) {
            showError("Ingrese nombres y apellidos");
            return;
        }
        if (step === 2 && (!formData.years || formData.years < 0 || !formData.user)) {
            showError("Ingrese edad y usuario");
            return;
        }
        if (step === 3 && (!formData.email || !formData.pass)) {
            showError("Ingrese email y contraseña");
            return;
        }

        step++;
        await tick();
    }

    // Regresar
    function prevStep() {
        if (step > 1) step--;
    }

    function submitForm() {
        if (!formData.email || !formData.pass) {
            showError("Ingrese email y contraseña");
            return;
        }

        try {
            fetch(`${pathBackend}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(res => {
                if(!res.ok) throw new Error('Error en el envio de información');
                return res.json();
            })
            .then(data => {
                console.log(data);
                if(data.success) {
                    alert('Usuario registrado exitosamente');
                    setCurrentPage('/');
                    navigate('/');
                }
            })
            .catch(err => {
                alert(err);
                step = 1;
            })
            .finally(() => {
                formData.names = "";
                formData.last = "";
                formData.years = 0;
                formData.user = "";
                formData.email = "";
                formData.pass = "";
            })
        } catch(e) {
            alert(e);
        }
    }
</script>

<svelte:head>
    <title>Registro</title>
</svelte:head>

<section class="register-container">
    {#if showToast}
        <div class="toast-message" in:fly={{ y: -50, duration: 300 }} out:fly={{ y: -50, duration: 300 }}>
            {toastMessage}
        </div>
    {/if}

    <div class="register-card">
        <div class="register-logo">
            <Link 
                to='/' 
                onclick={(event) => {
                    event.preventDefault();
                    setCurrentPage("/");
                    navigate("/");
                }} 
                class='register-brand flex items-center text-1xl font-semibold w-40'
            >
                <img class="w-8 h-8 mr-2" src="./logo.svg" alt="Flowbite Logo" />
                Iskandar APP
            </Link>
        </div>
        <h1 class="register-title">
            {step === 1 ? "Paso 1: Información Personal" :
            step === 2 ? "Paso 2: Información de Cuenta" :
            "Paso 3: Seguridad"}
        </h1>

        <form class="register-form">
            <div class="form-content">
                {#if step === 1}
                    <div in:fly={{ x: -100, duration: 400 }} out:fly={{ x: 100, duration: 0 }}>
                        <div class="input-group">
                            <label for="">Nombres</label>
                            <input type="text" bind:value={formData.names} class="input-field" placeholder="Ingrese su nombre" />
                        </div>
                        <div class="input-group">
                            <label for="">Apellidos</label>
                            <input type="text" bind:value={formData.last} class="input-field" placeholder="Ingrese su apellido" />
                        </div>
                    </div>
                {/if}

                {#if step === 2}
                    <div in:fly={{ x: -100, duration: 400 }} out:fly={{ x: 100, duration: 0 }}>
                        <div class="input-group">
                            <label for="">Edad</label>
                            <input type="number" bind:value={formData.years} class="input-field" placeholder="Ingrese su edad" />
                        </div>
                        <div class="input-group">
                            <label for="">Usuario</label>
                            <input type="text" bind:value={formData.user} class="input-field" placeholder="Ingrese su usuario" />
                        </div>
                    </div>
                {/if}

                {#if step === 3}
                    <div in:fly={{ x: -100, duration: 400 }} out:fly={{ x: 100, duration: 0 }}>
                        <div class="input-group">
                            <label for="">Email</label>
                            <input type="email" bind:value={formData.email} class="input-field"
                                placeholder="Ingrese su correo" />
                        </div>
                        <div class="input-group">
                            <label for="">Contraseña</label>
                            <input type="password" bind:value={formData.pass} class="input-field"
                                placeholder="Ingrese su contraseña" />
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Buttons -->
            <div class="button-group">
                {#if step > 1}
                    <button type="button" onclick={prevStep} class="btn-secondary">Back</button>
                {/if}
                {#if step < 3}
                    <button type="button" onclick={nextStep} class="btn-primary">Next</button>
                {/if}
                {#if step === 3}
                    <button type="button" onclick={submitForm}  class="btn-primary">Sign Up</button>
                {/if}
            </div>
        </form>
    </div>
</section>

<style lang="scss">
    .register-container {
        background-color: #111827;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .register-card {
        width: 100%;
        max-width: 400px;
        background-color: #1f2937;
        border-radius: 10px;
        padding: 24px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        border: 1px solid #374151;
        min-height: 280px;
        overflow: hidden;
    }

    .register-title {
        font-size: 20px;
        font-weight: bold;
        color: white;
        text-align: center;
        margin-bottom: 16px;
    }

    .toast-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #dc2626;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 999;
    }

    .form-content {
        min-height: 140px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
    }

    .input-group label {
        font-size: 14px;
        font-weight: 500;
        color: #d1d5db;
        margin-bottom: 4px;
    }

    .input-field {
        width: 100%;
        padding: 10px;
        background-color: #374151;
        border: 1px solid #4b5563;
        color: #d1d5db;
        border-radius: 6px;
        font-size: 14px;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
    }

    .btn-primary {
        background-color: #2563eb;
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
    }

    .btn-secondary {
        background-color: #4b5563;
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
    }
</style>
