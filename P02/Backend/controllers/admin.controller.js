const UserModel = require("../models/usuario.model");


const getAdmin = async (req, res, next) => {
    const userToken = req.user;
    try {
        if (!userToken) {
            const error = new Error('Acceso denegado: No se ha proporcionado token');
            error.statusCode = 401;
            throw error;
        }
        // console.log(userToken.id);
        const data = await UserModel.BuscarUsuario(userToken.email);
        const { pass, ...userData } = data;
        
        return res.status(200).json({ success: true, data: userData });
    } catch (err) {
        next(err);
    }
};
  

module.exports = {
    getAdmin
}