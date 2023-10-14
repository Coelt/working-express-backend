// App-Konstanten
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');               // CORS hinzugefügt
const app = express();
const port = process.env.PORT || 3000;      // Falls Port bei azure gibt, wird dieser genommen wenn nicht 3000
const FILENAME = __dirname + "/scannedbarcodes.json";


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//  log funktion um anfragen in der Konsole auszugeben.
function log(req, res, next) {
    console.log(req.method + " Request at " + req.url);
    next();
}
app.use(log);

//                            Termins Database Calls 
//______________________________________________________________________________________________________________


// GET-Route für die Wurzel
app.get('/', function (req, res) {
  return res.send("Hello World!");
});

// Endpoints
app.get("/barcodes", function (req, res) {
  fs.readFile(FILENAME, "utf8", function (err, data) {
      res.json(JSON.parse(data));
  });
});

app.post("/barcodes", function (req, res) {
  fs.readFile(FILENAME, "utf8", function (err, data) {
      let barcodes = JSON.parse(data);
      let newBarcode = req.body.barcode; // assuming the barcode is sent as { "barcode": "1234567890" }

      if (!barcodes.includes(newBarcode)) { // check to ensure the barcode is unique
          barcodes.push(newBarcode);
      }

      fs.writeFile(FILENAME, JSON.stringify(barcodes), () => {
          res.json(barcodes);
      });
  });
});



//______________________________________________________________________________________________________________

// Startet den Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
