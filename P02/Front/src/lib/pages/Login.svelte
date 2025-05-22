<script>
    import '../styles/login.scss';
    import { Link, navigate } from "svelte-routing";
    import { isAuthenticated, loginUser } from "../../stores/auth.store";
    import { onMount } from "svelte";
    import { pathBackend } from "../../stores/host";
    import { handleAuthAndNavigation, setCurrentPage } from '../../stores/page.store';

    let credencial = $state('');
    let contrasenia = $state('');

    onMount(() => {
        isAuthenticated.subscribe(auth => {
            console.log("User authenticated:", auth);
            handleAuthAndNavigation();
        });
    });

    function getData(rol) {
        const pathToGet = rol === 'admin' ? 
            `${pathBackend}/admin/profile` : rol === 'user' ?
            `${pathBackend}/user/profile` : '';

        fetch(pathToGet, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => {
            console.log(res);
            if(!res.ok) throw new Error('Error en la obtención')
            return res.json();
        })
        .then(data => {
            // console.log(data);
            if(data.success) {
                loginUser(data.data);
                setCurrentPage('/home');
                navigate('/home');
                window.location.reload();
            } else {
                throw new Error('Error en inicio de sesión');
            }
        })
        .catch((e) => {
            alert(e);
        })
    }

    function loginCredentials() {
        if(!credencial || !contrasenia) {
            alert('Ingrese usuario y contraseña');
            return;
        }

        fetch(`${pathBackend}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credentials: credencial, pass: contrasenia }),
        })
        .then(res => {
            if(!res.ok) throw new Error('Error en la solicitud');
            return res.json();
        })
        .then(data => {
            console.log(data);
            if(data.success) {
                getData(data.rol);
                console.log('Login successful');
            }
        })
        .catch((e) => {
            alert(e);
        })
        .finally(() => {
            credencial = ''
            contrasenia = ''
        })
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<section class="bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 sm:p-8">
        <div class="flex flex-col items-center mb-6">
            <Link to='/' class='flex items-center text-2xl font-semibold text-white'>
                <img class="w-8 h-8 mr-2" src="./logo.svg" alt="Flowbite Logo" />
                Iskandar APP
            </Link>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-white text-center">
            Inicio Sesión
        </h1>
        <form class="mt-6 space-y-4">
            <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-300">
                    Usuario/Contraseña
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    bind:value={credencial}
                    class="w-full p-2.5 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="youraccount@example.org"
                />
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-300">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    bind:value={contrasenia}
                    placeholder="••••••••"
                    class="w-full p-2.5 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                />
            </div>
            <!-- <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        class="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-blue-500"
                    />
                    <label for="remember" class="ml-2 text-sm text-gray-300">
                        Remember me
                    </label>
                </div>
                <a href="#" class="text-sm text-blue-500 hover:underline">
                    Forgot password?
                </a>
            </div> -->
            <button
                onclick={() => loginCredentials()}
                class="w-full px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm text-center"
            >
                Sign in
            </button>
            <p class="text-sm text-gray-300 text-center">
                Don’t have an account yet?
                <Link
                    to='/register'
                    onclick={(event) => {
                        event.preventDefault();
                        setCurrentPage("/register");
                        navigate('/register');
                    }}
                    class="font-medium text-blue-500 hover:underline"
                >
                    Sign up
                </Link>
            </p>
        </form>
    </div>
</section>