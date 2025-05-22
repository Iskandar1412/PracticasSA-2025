module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define("Roles", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rol: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        tableName: 'roles',
        timestamps: false
    })
}
