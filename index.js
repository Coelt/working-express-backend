// App-Konstanten
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb'); // Hier importiere ich MongoClient aus mongodb
const cors = require('cors');               // CORS hinzugefügt
const app = express();
const port = process.env.PORT || 3000;
const dbName = 'CleanRedDatabase';          // Set your database name here

// need to be stored in .env
const mongoUrl = 'mongodb://clean-red-db:9RaOmNUJZaAk9V4j7PUFCJ1hNjJhCCoNsDj2tHkauKxltJ6Q7oz8xdgq7z67C9aTTlHJLhV2WTXaACDbp8Im4g==@clean-red-db.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@clean-red-db@';
const apiKey = 'gnuwZGN4789GZ';

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


//______________________________________________________________________________________________________________

// Startet den Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
