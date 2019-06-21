var mongoose 	= require('mongoose');  
var Schema   	= mongoose.Schema;



var infonectaImportSchema = new Schema({  
  dua: String,
  item: String,
  fecha: String,
  posicion: String,
  importador: String,
  localidad: String,
  destinacion: String,
  aduana: String,
  via: String,
  origen: String,
  procedencia: String,
  fobusd_unit: String,
  fobusd: String,
  fleteusd: String,
  segurousd: String,
  cifusd: String,
  cant_estad: String,
  un_medida_estad: String,
  cantidad_com: String,
  unidad_com: String,
  pesoneto: String,
  pesobruto: String,
  derecho: String,
  derecho_por: String,
  cantidad_com: String,
  unit_divisa: String,
  fob_divisa: String,
  moneda_divisa: String,
  cond_vta: String,
  detalle: String,
  marca: String,
  modelo: String,
  descripcion_arancel: String  
});

// // Execute before each user.save() call
// userSchema.pre('save', function(callback) {
//   var user = this;

//   // Break out if the password hasn't changed
//   if (!user.isModified('password')) return callback();

//   // Password changed so we need to hash it
//   bcrypt.genSalt(5, function(err, salt) {
//     if (err) return callback(err);

//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return callback(err);
//       user.password = hash;
//       callback();
//     });
//   });
// });



module.exports = mongoose.model('InfonectaImport', infonectaImportSchema);  