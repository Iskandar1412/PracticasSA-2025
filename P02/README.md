# Documentación del Proyecto

## Herramientas de backend y frontend utilizadas, incluyendo la base de datos y ventajas y desventajas de las mismas

| Teconología | Uso |
|---|---|
| NodeJS (JS) | Backend |
| MySQL | Base de Datos |
| Svelte | Frontend |

Ventajas vistas en cada una
* **Backend (NodeJS):** Node es simple en su uso, aparte de la documentación sobre el uso de varias librerías, a comparación de Go, Python, yo lo veo más cómodo (mucho tiempo de uso)

* **Frontend (Svelte):** A comparación de REACT, es más cómodo, simplificando el uso de variables Reactivas, sin tomar en cuenta la similitud que tiene con VueJS, que pese a verse similares, tienen una manera diferente en definición, sentencias en bloques (cosa que amo de Svelte, sus bloques de condiciones), y sobre todo no estar usando el `return` para retornar componentes como era en REACT (aunque suene a queja, me siento más comodo dedicando tiempo a inyectar variables al código que estar utilizando los UseState, UseRef, etc...); de ahí otra ventaja vista es lo rápida en su compilación, ya que Svelte salta un poco lo del proceso de compilación a diferencia de React, volviendo más simple la interacción con el DOM y la actualización del mismo.

* **Base de Datos (MySQL):** Creo que es uno de los que más se utiliza debido a la simplicidad de la misma, en caso de usar docker para entornos de producción, se mira como la opción más viable, aunque PostgreSQL tambien es otra buena opción; recomendación del uso... la que uno sepa mejor.

### Instrucciones para Ejecutar el Proyecto

#### 1. Clonar el repositorio:

```bash
git clone https://github.com/Iskandar1412/Practicas-SA-B-201906051.git
cd Practicas-SA-B-201906051/P02
# Abrir con vs code
code .
```

##### a. Instalación dependencias (Front <Svelte>, Backend)

```bash
npm i
```

|Guia instalacion en Backend| -- |
| --- | --- |
| Instalación Backend | [Archivo](./Backend/config/) |

##### b. Ejecutar Backend y Frontend

```bash
npm run dev
```

##### c. Variables de Entorno utilizadas para el backend

| Variable de Entorno | Valor |
| --- | --- |
| DB_HOST | localhost |
| DB_USER | root |
| DB_PASSWORD | iskandar |
| DB_PORT | 3306 |
| DB_DB | SAPR02 |
| JWT_SECRET | SA1S2025 |
| JWT_EXPIRATION | 1h |
| JWT_REFRESH_EXPIRATION | 3d |
| PORT_APP | 5200 |
| AES_KEY | b8faf154b7ae27b970b012a11556e819bd59d41bc2a054f5b0dd67197a75cb30 |
| AES_IV | 81b704e80c7c1991bf143507140a8dfb |

Se utilizaron las siguientes variables de entorno para lo que es la base de datos que son las primeras 5, de ahí 3 para lo que es JWT una para el puerto para la aplicación de Backend y por último las 2 (AES) que son para el cifrado que se aplicará a todos (o casi todos) los valores de los usuarios.

#### 2. Código
##### a. Base de Datos

Se definieron las siguientes tablas (tomando en cuenta la escalabilidad a la hora de agregar más tipos de usuarios <roles>)

```sql
create database if not exists SAPR02;
use SAPR02;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL DEFAULT 'usuario',
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);
```

Tomar en cuenta que el backend ya genera las tablas y procedimientos de manera automática, por lo que no es necesario insertar las tablas por comandos, solo la generación de la base de datos.

Ahora bien ¿Cómo se automatizó ese proceso?, para evitar la desmesurada inserción de cambios en los procedimientos (por anteriores proyectos que resultaban demasiados procedimientos), se automatizó este proceso, al menos en esa parte, en caso de hacer un docker-compose para que ejecute el archivo con todas las tablas tambien está bien, pero tomando cambios que se le pueden hacer a procedimientos y tablas, se tuvo en cuenta lo siguiente:

```js
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DB } = require('../config/db.config');

const sequelize = new Sequelize(DB_DB, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexión establecida exitosamente');
    })
    .catch((e) => {
        console.log('Error en la conexión con la base de datos:', e);
    });
```

Se utilizará "Sequelize" para hacer una conexión con la base de datos para interactuar con la misma sin necesidad de querys (yo lo tomo de forma híbrida, ya que hay procedimientos que facilitan el proceso del uso de estas y darle mayor provecho a no estar expandiendo o haciendo más robusto el código para las consultas).

Ahora bien... si tomamos lo que es la autenticación anterior, primero creamos las tablas para que se sincronice con la base de datos `SAPR02`.


```js
const Usuario = require('./templates/user.model')(sequelize, DataTypes);
const Roles = require('./templates/roles.model')(sequelize, DataTypes);

sequelize.sync({alter: true})
.then(() => {
    console.log('Base de datos actualizada');
})
.catch((er) => {
    console.log('Error en actualizar tablas de la base de datos:', er);
});
```

con esto se hace la sincronización con la base de datos (tomar en cuenta que `alter: true` cada vez que se reinicie el servidor, va a sincronizar con la base de datos, sin importar si se han actualizado las tablas en cuanto a valores o campos).

```js
async function addProcedures(params) {
    try {
        const files = fs.readdirSync(params);
        for (const file of files) {
            const ruta = path.join(params, file);
            if(fs.lstatSync(ruta).isDirectory()) {
                await addProcedures(ruta);
            } else if (path.extname(ruta) === '.sql') {
                const sql = fs.readFileSync(ruta, {encoding: 'utf-8'});
                await sequelize.query(sql);
                const archivo_split = ruta.split('/');
                const nombre_archivo = archivo_split[archivo_split.length -1];
                const formateo = nombre_archivo.padEnd(30, ' ');
                console.log(`${formateo}\t\t\t ejecutado`);
            }
        }
    } catch(e) {
        console.log('Error creación procedimientos', e)
    }
}

async function addRoles() {
    try {
        const roles = [
            { "rol": "admin" },
            { "rol": "user" }
        ];

        for (const rol of roles) {
            const [peticion] = await pool.promise().query('SELECT COUNT(*) as count FROM roles WHERE rol = ?', [rol.rol]);
            if(peticion[0].count === 0) {
                await pool.promise().query('CALL registrar_rol(?)', [rol.rol]);
                console.log(`Rol ${rol.rol} creado.`);
            } else {
                console.log(`Rol ${rol.rol} existente`);
            }
        } 
    } catch(e) {
        console.log('Error en la inserción de roles');
    }
}

(async function() {
    try {
        const del = path.join(__dirname, './db_del/clear.sql');
        console.log("Eliminando procedimientos");
        await deleteProcedures(del);
        console.log("Fin Eliminación...");
        
        const procedimientos = path.join(__dirname, './procedures/');
        console.log("Creando procedimientos");
        await addProcedures(procedimientos);
        console.log("Fin Creación...");
        
        console.log("Creando roles");
        await addRoles();
        console.log("Fin Creación...");
    } catch(e) {
        console.log('Error en la ejecución de funciones', e);
    }
})();

module.exports ={
    sequelize,
    Usuario,
    Roles
}
```

Con las últimas líneas de código, lo que se hace es declarar los métodos para la creación de los procedimientos dentro de una carpeta y tambien, de borrarlos (ya que no encontre una forma de que se modifiquen como tal, dandome errores, por lo que mejor borrarlos y volver a crearlos, de esta forma siempre estarán actualizados los procedimientos); finalizando con ello exportamos los métodos de Usuario, Roles y sequielize.

* **Ventajas que se le vieron a la automatización de la conexión a la base de datos y creación/eliminación de procedimientos:** `R//` Simplificación y libertad para centrarse en el código, puede que al inicio lleve tiempo la "automatización", pero conforme se avanza en el proyecto, libera el tiempo de estar ejecutando los procedimientos en la consola de comandos de SQL.

##### b. Backend

En el backend que se realizo, se trato de fragmentar y dividir todas las funciones para una posterior extensión de la misma y que el código este más organizado y mejor modularizado entre funciones (como siempre hay margen de mejora en las funciones para exportar).

Primero utilizaremos lo que es CORS y las conexiones básicas

* cors.options.js
```js
const allowedOrigins = ['http://localhost:5173', 'http://192.168.0.9:5173', 'http://192.168.0.19:5173'];

const corsOptions = {
    origin: function(origin, callback) {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('Origin not allowed by CORS'));
        }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

module.exports = corsOptions;
```

* index.js
```js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler  = require('./middleware/error.handler');
const corsOptions  = require('./utils/cors.options');

const app = express();

app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next();
})
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

module.exports = app;
```

* server.js
```js
require('dotenv').config();
const app = require('./index');
const { PORT_APP } = require('./config/app.config');
const port = PORT_APP || 3000;

app.listen(port, () => {
    console.log(`Servidor (puerto): ${port}`)
});
```

Iremos por pasos, el primero que es `cors.options.js` en este módulo se fragmento para la hora de que digamos tenemos más de un dominio del cual recibiremos respuestas (dado que no se puede hacer envio de Cookies si se pone como `*` en lo que es el origen de direcciones, por lo que se definieron los casos en los que aceptará y los casos en los que va a rechazar CORS)... tomar en cuenta que mi Docker en Windows estiro la pata y por lo tanto el front se ejecutaba desde otro ordenador para hacer peticiones al backend dentro de mi pc de linux, por lo agregué las direcciones que podría aceptar, como aqui reflejamos cuales direcciones serán aceptadas, ahí es lo que tomaremos en cuenta.

Para poder aceptar el envio y recivo de Cookies se utilizo `credentials: true`.

En el index, no hay mucho que se pueda decir, más que es el cual tiene las configuraciones de Morgan (para estar imprimiendo solicitudes), nodemon (para que se reinicie el servidor a la hora de encontrar cambios o se actualice algun componente), y las importaciones de los Middleware de errores, antes que se me olvide, esta el `app.use(cookieParser())` que se encargará de hacer que acepte las Cookies como tal, sino F.

El último que es `server.js` no tiene nada nuevo a parte de la importación de las configuraciones de `Index.js` la declaración del puerto que esta en la variable de entorno que se mostro anteriormente y solo su ejecución.

Tomaremos ahora lo que es la encripción y desencripción con AES-CBC

```js
const { AES_KEY, AES_IV } = require('../config/aes.config');
const crypto = require('crypto');
const aes = 'aes-256-cbc'; // algoritmo aes
const key = Buffer.from(AES_KEY, 'hex'); // clave de 32 bytes para aes
const iv = Buffer.from(AES_IV, 'hex'); // vector de inicialización para aes (16 bytes)

const encrypt = (value) => {
    if (!value) throw new Error('Necesario el valor para encriptar');
    try {
        let cifrado = crypto.createCipheriv(aes, key, iv);
        let encriptado = cifrado.update(value, 'utf-8', 'hex');
        encriptado += cifrado.final('hex')
        return encriptado;
    } catch(e) {
        throw new Error('Operación Fallida (encripcion)');
    }
}

const decrypt = (value) => {
    if(!value) throw new Error('Valor encriptado invalido');
    try {
        let cifrado = crypto.createDecipheriv(aes, key, iv);
        let decifrado = cifrado.update(value, 'hex', 'utf-8');
        decifrado += cifrado.final('utf-8');
        return decifrado;
    } catch(e) {
        throw new Error('Operación Fallida (desencripcion)');
    }
}
```

Sabemos que necesitamos para AES es una llave y un vector de inicialización, hay dos opcions que se pueden tomar: hacerlo dinámicamente (la cual no vale mucho la pena ya que al reiniciar todo, no se podría desencriptar nada) y la segunda sería dejarlo definido en las variables de entorno (opción más valida y obvia para su uso) de ahí lo que hacemos es definir el tipo de encripción y desencripción (AES en este caso).

En la función de encriptado o desencriptado si bien no es necesaria la función de validar si existe o no, bien es necesaria a la hora de estar validando que no envie valores nulos (cosa que al inicio puede suceder). Ciframos con crypto y creamos un cifrado, para luego devolverlo como hexadecimal, en el caso de desencripción se hace el proceso opuesto, devolverlo a utf-8.

Iremos por una de las cosas más importantes para los usuarios (la base para la base de datos y los usuarios a crear)

```js
const UserModel = {
    BuscarUsuario: async(credenciales) => {
        const [response] = await pool.query('CALL buscar_usuario(?)', [encrypt(credenciales)]);
        resultado = response[0][0];
        if(resultado && resultado.id !== null) {
            resultado.nombres = decrypt(resultado.nombres);
            resultado.apellidos = decrypt(resultado.apellidos);
            resultado.usuario = decrypt(resultado.usuario);
            resultado.email = decrypt(resultado.email);
            return resultado;
        }
        return null;
    },

    CrearCuentaUsuario: async (nombres, apellidos, edad, usuario, correo, contrasenia) => {
        const nombreEncriptado = encrypt(nombres);   
        const apellidoEncriptado = encrypt(apellidos);   
        const usuarioEncriptado = encrypt(usuario);   
        const correoEncriptado = encrypt(correo);

        const rondas = 10;
        const hashPassword = await bcrypt.hash(contrasenia, rondas);
        const [response] = await pool.query('CALL registrar_usuario(?,?,?,?,?,?)',
            [nombreEncriptado, apellidoEncriptado, edad, usuarioEncriptado, correoEncriptado, hashPassword]
        );
        return response;
    },

    CrearCuentaAdministrador: async (nombres, apellidos, edad, usuario, correo, contrasenia) => {
        const nombreEncriptado = encrypt(nombres);   
        const apellidoEncriptado = encrypt(apellidos);   
        const usuarioEncriptado = encrypt(usuario);   
        const correoEncriptado = encrypt(correo);

        const rondas = 10;
        const hashPassword = await bcrypt.hash(contrasenia, rondas);

        const [response] = await pool.query('CALL registrar_administrador(?,?,?,?,?,?)',
            [nombreEncriptado, apellidoEncriptado, edad, usuarioEncriptado, correoEncriptado, hashPassword]
        );
        return response;
    },
}
```

Aqui practicamente se manejará toda la logica de creación de cuentas, y obtención de usuarios, prácticamente, se encargará de desencriptar y encriptar los valores que van y vienen de la base de datos. Tratando de hacerlo lo más limpio posible para futuras funciones que pueda tener un usuario (cambio de usuarios para el administrador puede ser).

Ahora bien... ¿aun no se ha hablado de JWT? ¿Se olvido?, la verdad es que no.

```js
const autenticar = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        const error = new Error('Acceso denegado: No se ha proporcionado token');
        error.statusCode = 401;
        return next(error);
    };

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) {
            const error = new Error('Acceso denegado: Token invalido o expirado');
            error.statusCode = 403;
            return next(error);
        };
        
        const now = Math.floor(Date.now() / 1000);
        const exp = user.exp;

        if(exp - now < 300) {
            const nuevoToken = refrescarToken(user);
            res.cookie('token', nuevoToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            });
        }
        
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if(req.user.rol !== 'admin') {
        const error = new Error('Acceso denegado: No hay permisos de administrador');
        error.statusCode = 403;
        return next(error);
    }

    next();
}
```

Aqui defini 2 funciones para lo que es el middleware para autenticación con JWT, si bien se pueden ver 2 funciones `autenticar` y `isAdmin` para lo que son los usuarios, uno se aplica como capa extra para los que administran el sistema y sus rutas, mientras que el usuario no tiene ello, o mas bien, en dado caso se probasen las credenciales para el envio de información, rechazaría el usuario ya que el token no es valido para usuarios en la capa de administrador, veamos un ejemplo de ello.

* admin.routes.js

```js
router.get('/profile', autenticar, isAdmin, getAdmin);
```

* user.routes.js

```js
router.get('/profile', autenticar, getUser);
```

Si vien se mira en la de administrador (tomar en cuenta que para el administrador todas las rutas verificarán que sea administrador). tiene tanto `autenticar` como `isAdmin` una es la primera capa del JWT que verifica el token, su tiempo, el tiempo que le queda al token para expirar y se encarga de reanuevarlo, teniendo como segunda capa lo que es la verificación que es un administrador, dado el caso que no podría ingresar un usuario normal a las funciones que tiene el administrador.

En el caso del usuario normal y otros roles que existan (posible se les haga autenticaciones agregando otras capas, pero dependerá de la seguridad que uno quisiera darle al programa) dejando solo la capa de la autenticación que refrescaría el token cuando este en el rango de 5 minutos para su expiración.

##### c. Frontend

Ahora venimos con la guinda del pastel... la parte visual (que dolor fue hacerlo), se realizo en Svelte, ¿Por qué no se uso Svelte Kit?: R// No lo he usado, ¿Por qué Svelte? R// tengo un curso en el que lo he aprendido y me ha resultado mucho más cómodo que React en lo que son declaraciones, funciones y demás. Empecemos con el Front como tal, este contará con varios Stores para lo que es almacenamiento de usuario loggeado, pagina en la que estuvo el usuario, el host que quiera o no puede ser diferente (big depending de donde se conecte front con back) y otros que serviran para guardar algunas funciones dentro de lo visual.


* App.svelte
```svelte
<script>
  import { Route, Router } from "svelte-routing";
  import { onMount } from "svelte";
  import { isAuthenticated, user } from "./stores/auth.store";
  import Login from "./lib/pages/Login.svelte";
  import Register from "./lib/pages/Register.svelte";
  import { handleAuthAndNavigation, setCurrentPage } from "./stores/page.store";
  import Base from "./lib/pages/Base.svelte";
  import Home from "./lib/pages/global/Home.svelte";

  onMount(() => {
    isAuthenticated.subscribe(auth => {
      console.log("User authenticated:", auth);
      if(!auth) {
        setCurrentPage('/');
      }
      handleAuthAndNavigation();
    });
  });
</script>

<Router>
  <Route path="/"><Login /></Route>
  <Route path="/register"><Register /></Route>
  <Route path="/home">
    <Base Component={Home} />
  </Route>
  
</Router>
```

Tendrá las definiciones de las rutas para sus usos, si se mira vien hay un `handleAuthAndNavigation`,  este se encarga de verificar que la cuenta este loggeada, para su enrutamiento directo, en caso contrario guarda tambien las páginas en las que uno esta antes de hacer el Refresh de la página.

Pero a pesar de todo no se dará una excursión por todo, iremos por lo más importante: **Las peticiones Front/Back**.

* Register.svelte
```svelte
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
```

Este se encarga de la lógica de registro de usuarios, bien que se mira que tiene lo que es la verificación que las variables no estén vacias para hacer la petición con el backend y el posterior registro de usuarios, en caso que cumpla con el registro, lo que hará será alertar del registro exitoso y de la redirección de página para el login, en caso contrario reseteará las variables y regresará al paso inicial de registro.


* Login.svelte
```svelte
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
```

Ya se que puede estar mejor, opciones que pensaba, hacer una página que fuera conector entre la página de usuario y el login (página de carga) para que hiciera la petición requerida y obtener los datos que requeria, pero.... me di a lo más fácil, poner una que siga de otra y la razón por la que lo hice fue... el tiempo, ya me llevo el estar haciendo que las Cookies las aceptara y no me dio tanto como para hacer una página de carga, pero a lo que vamos...

Se hace la verificación de credenciales con el endpoint de Login del usuario, ahí es donde desencripta la iformación de lo que es el usuario y todo lo que tiene el usuario para hacer la verificación que concuerde, y enviar si las credenciales son correctas o no. La otra solo carga al LocalStorage la data del usuario Loggeado, y bien ahí podría llegar una sopa en la que exista la duda ¿por qué no se hizo en otra página?, bien si la tenia contemplada, pero llevava más tiempo, por lo que cuando me salio de esta forma, opte por terminar diseño y funcionalidades; como diría "mejor funcional y lo mejor posible a tratar una perfección fuera de tiempo".

Y... eso sería todo lo del código UwU, bien no se puede agregar más, ya que no tiene tantas funciones, pero bien se puede decir que esta contemplado este proyecto para volverlo más robusto, así que ahí iría algo que digo otra ves "ya es código para reutilizar a furuto".


## Tecnologías y Herramientas Utilizadas

### Backend: Node.js + Express + MySQL

**Ventajas:**

* Escalable y eficiente en aplicaciones web.</br>
* Express es minimalista y rápido.</br>
* MySQL es una base de datos relacional estable y bien soportada.</br>

**Desventajas:**

* Node.js no es ideal para aplicaciones con operaciones intensivas en CPU.</br>
* MySQL puede ser menos flexible en comparación con bases de datos NoSQL.</br>

### Frontend: Svelte

**Ventajas:**

* Genera código altamente optimizado sin virtual DOM.</br>
* Menos sobrecarga de JavaScript en el navegador.</br>
* Sintaxis intuitiva y fácil de aprender.</br>

**Desventajas:**

* Menor comunidad y ecosistema en comparación con React/Vue.

### Base de Datos: MySQL

**Ventajas:**

* Soporta transacciones y ACID.</br>
* Muy utilizado y documentado.</br>

**Desventajas:**

* Puede ser más lento en consultas complejas que bases NoSQL.</br>
* Necesita optimización en grandes volúmenes de datos.</br>

## Cookies HTTP/HTTPS Only y Algoritmo AES

### Cookies HttpOnly y Secure:

* Una cookie con el atributo HttpOnly no puede ser accedida desde JavaScript en el navegador, previniendo ataques XSS.</br>
* Si se añade el flag Secure, la cookie solo se enviará en conexiones HTTPS, protegiendo contra ataques MITM (man-in-the-middle).</br>

### AES (Advanced Encryption Standard):

* Algoritmo de cifrado simétrico utilizado para proteger datos.</br>
* Funciona con claves de 128, 192 o 256 bits.</br>
* Muy seguro y eficiente en términos de rendimiento.</br>

## JSON Web Token (JWT)

### ¿Qué es JWT?

* JSON Web Token (JWT) es un estándar de autenticación basado en tokens.</br>
* Se usa para autenticar usuarios sin necesidad de enviar credenciales en cada petición.</br>
* El token es generado en el backend y enviado al cliente, que lo incluye en cada solicitud posterior.</br>

Digamos tenemos el siguiente JWT:

```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExIiwiZW1haWwiOiJmYWEiLCJyb2wiOiJ1c2VyIiwiaWF0IjoxNzQwNDUwMDk1LCJleHAiOjE3NDA0NTM2OTV9.uFpGMhwcmnikHrDf0BQ-ASLjkkoV4OAO4tqrWrJ7Trg
```

En este caso nuestro Header sería:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Y el Payload:

```json
{
  "id": "11",
  "email": "faa",
  "rol": "user",
  "iat": 1740450095,
  "exp": 1740453695
}
```

También hay un HASH para verificar que no se ha cambiado el JWT, pero como la página oficial que desencripta el JWT no me lo da o no me lo muestra quedará a la deriva momentaneamente. Aquí cada parte tiene su rol

* Header: Especifica el algoritmo de firma (ej. HS256).</br>
* Payload: Contiene la información del usuario.</br>
* Firma: Se usa para verificar que el token no fue alterado.</br>

### Diagrama de Secuencia: Autenticación con JWT

![](./Documentacion/graphviz.svg)

Como se puede ver el diagrama de JWT

#### Lado del usuario al cliente (en este caso el Front/Svelte)

* El usuario ingresa su correo o email y su contraseña en la interfáz del usuario.</br>
* El cliente va a capturar los datos y los envia al servidor para la autenticación de los datos.</br>

#### Aquí ya entra del cliente al servidor la interacción

* Se realiza una solicitud HTTP (POST) con las credenciales del usuario al backend.</br>
* El cliente en este caso va a estar esperando una respuesta del servidor (en el cual acepte las credenciales = credenciales correctas, o las rechace = credenciales no validas).</br>

#### Vamos del servidor a la Base de datos

* El servidor va a recibir las credenciales, una vez las tiene, hará consultas a la base de datos para verificar qu3 el usuario exista, al igual que la contraseña.</br>

#### Caso de credenciales Invalidas

* La base de datos va a informar que el usuario o la contraseña no existen o son incorrectas, depende de la lógica de verificación de usuarios y contraseñas.</br>
* El servidor va a responder con un mensaje de error.</br>
* El cliente va a mostrar al usuario el mensaje de error.</br>
