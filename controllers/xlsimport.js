// Load required packages
var mongoose = require('mongoose');
var xlsImport = mongoose.model('InfonectaImport');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var path = require('path');
const fs = require('fs');

/****************************MULTER****************************/
// Configuración de la carpeta uploads
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
  }
});
var upload = multer({ //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) { //file filter
    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
}).single('file');



exports.xlsimportFile =  function (req, res) {
  console.log("importing XLS");
  var importadoOk = 0;
  var exceltojson; //Initialization
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "No file passed" });
      return;
    }
    //start convert process
    /** Check the extension of the incoming file and 
     *  use the appropriate module
     */
    if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }
    try {
      exceltojson({
        input: req.file.path, //the same path where we uploaded our file
        output: null, //since we don't need output.json
        lowerCaseHeaders: true
      }, function (err, result) {
        if (err) {
          return res.json({ error_code: 1, err_desc: err, data: null });
        }
        console.log("parseado el XLS, trabajando...")
        // ACA TRABAJAR CON EL JSON "result"
        result.forEach(async element => {

          var existe = await importfind(element);
          if (existe)
          console.log("ya existe");
          else {
            saveXlsImport(element);
            console.log("grabado");
          }
            


        });


        res.json({ importado_Ok: importadoOk, data: result });

      });
    } catch (e) {
      res.json({ error_code: 1, err_desc: "Corupted excel file" });
    }
  });
};


importfind =  async function (element) {
  console.log(element.dua);

  return xlsImport.findOne({
            dua: element.dua,
            item: element.item,
            posicion: element.posicion
          }).exec().then((err, elem) => {
            return err;
          });
}

saveXlsImport = function (data) {

  
    //item does not exist
    re = /\((.*?)\)/g;
    var datos = data.detalle.match(re);
    var marca = datos[1];
    var modelo = datos[2];

    var xlsimport = new xlsImport({
      dua: data.dua,
      item: data.item,
      fecha: data.fecha,
      posicion: data.posicion,
      importador: data.importador,
      localidad: data.localidad,
      destinacion: data.destinacion,
      aduana: data.aduana,
      via: data.via,
      origen: data.origen,
      procedencia: data.procedencia,
      fobusd_unit: data.fobusd_unit,
      fobusd: data.fobusd,
      fleteusd: data.fleteusd,
      segurousd: data.segurousd,
      cifusd: data.cifusd,
      cant_estad: data.cant_estad,
      un_medida_estad: data.un_medida_estad,
      cantidad_com: data.cantidad_com,
      unidad_com: data.unidad_com,
      pesoneto: data.pesoneto,
      pesobruto: data.pesobruto,
      derecho: data.derecho,
      derecho_por: data.derecho_por,
      cantidad_com: data.cantidad_com,
      unit_divisa: data.unit_divisa,
      fob_divisa: data.fob_divisa,
      moneda_divisa: data.moneda_divisa,
      cond_vta: data.cond_vta,
      detalle: data.detalle,
      marca: marca,
      modelo: modelo,
      descripcion_arancel: data.descripcion_arancel
    });

    xlsimport.save(function (err) {
      if (err) {
        console.log(err);
        return 0;
      }
      else {
        return +1;
      }
    });  
}
