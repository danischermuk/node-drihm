// Load required packages
var pdfMakePrinter = require('pdfmake');
var path = require('path');
const fs = require('fs');


var docDefinition = {
    content: ['This will show up in the file created']
  };

generatePdf = function(docDefinition, callback) {
  try {
    function fontPath(file) {
        return path.resolve('node_modules','pdfmake', file);
      }
    var fontDescriptors = {
        Roboto: {
          normal: fontPath('Roboto-Regular.ttf'),
          bold: fontPath('Roboto-Medium.ttf'),
          italics: fontPath('Roboto-Italic.ttf'),
          bolditalics: fontPath('Roboto-Italic.ttf'),
        }
      }; 
      const printer = new pdfMakePrinter(fontDescriptors);
      const doc = printer.createPdfKitDocument(docDefinition);
  
      doc.pipe(
        fs.createWriteStream('Z:/Dani/filename3.pdf').on("error", (err) => {
          console.log(err.message);
        })
      );
  
      doc.on('end', () => {
        console.log("PDF successfully created and stored");
      });
      
      doc.end();
      
  } catch(err) {
    throw(err);
  }
};


exports.pdfMakePDF = function (req, res) {
    generatePdf(docDefinition, (response) => {
      // doc successfully created
  res.json({
    status: 200,
    data: response
  });
}, (error) => {
  // doc creation error
  res.json({
    status: 400,
    data: error
  });
      });	
};
