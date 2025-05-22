require('dotenv').config(); // npm i dotenv
const app = require('./index');
const { PORT_APP } = require('./config/app.config');
const port = PORT_APP || 3000;

app.listen(port, () => {
    console.log(`Servidor (puerto): ${port}`)
});
