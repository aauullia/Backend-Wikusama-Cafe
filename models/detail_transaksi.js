'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi detail ke transaksi 
      //relasi 1 to 1 
      this.belongsTo(models.transaksi,{
        foreignKey:'id_transaksi',
        as:'transaksi'
      })

      //relasi detail ke menu 
      //relasi 1 to 1 
      this.belongsTo(models.menu, {
        foreignKey:'id_menu',
        as:'menu'
      })
      
    }
  }
  detail_transaksi.init({
    id_detail_transaksi: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    id_transaksi: DataTypes.INTEGER,
    id_menu: DataTypes.INTEGER,
    harga: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName: 'detail_transaksis'
  });
  return detail_transaksi;
};