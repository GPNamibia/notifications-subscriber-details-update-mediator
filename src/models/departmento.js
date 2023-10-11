module.exports = (sequelize, DataTypes) => {
    const departmento = sequelize.define("departmento", {
            coddpto: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        nomdpto: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        }
    });

    return departmento;
};