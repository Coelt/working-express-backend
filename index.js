// App-Konstanten
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');               // CORS hinzugefügt
const app = express();
const port = process.env.PORT || 3000;      // Falls Port bei azure gibt, wird dieser genommen wenn nicht 3000
const FILENAME = __dirname + "/scannedbarcodes.json";
const { MongoClient } = require('mongodb'); // Hier importiere ich MongoClient aus mongodb
const dbName = 'Barcode';          // Set your database name here
const collectionName = 'barcode';
const mongoUrl = 'mongodb://funktioniert:mfNS3h45A5D8PeGY089bJANCEc34lWdrZlL81vEsHQrBmnNWRq0yUhnpRZIUVc4fMg9YKN5iXVuHACDbGxzylg==@funktioniert.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@funktioniert@';


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

// Verbindung zur MongoDB herstellen, bevor der Server gestartet wird
async function connectToMongoDB() {
    try {
        const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
        await client.connect(); // Verbindung zur MongoDB herstellen
        db = client.db(dbName); // Select the MongoDB database
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

let db;
connectToMongoDB();

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

app.get("/mongoBarcodes", function (req, res) {
  try{
      const collection = db.collection(collectionName);
      const barcodes = await collection.find({}).toArray();
      return res.json(allAppointments);
  }   catch(error) {
      return res.status{500}.json({ error: 'Error retrieving appointments'});
  }
      
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
