module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define("Usuario", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombres: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        apellidos: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        edad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        usuario: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        contrasenia: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        rol_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id"
            }
        }
    }, {
        tableName: 'usuarios',
        timestamps: false
    })
}