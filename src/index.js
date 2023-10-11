const express = require("express");
const router = require("./routes");
const privateConfig = require("./config/private-config.json");
const { getQueryParameters } = require('./openHIM/initialize.js');
const bodyParser = require('body-parser');
const controller=require('./Controller/controller')
const db = require('./models');
const cors = require('cors');
const customContentRangeMiddleware = require('./range');

const corsOptions = {
  origin: privateConfig.development.adminPortal.url,
  optionsSuccessStatus: 200,
};


const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(customContentRangeMiddleware);
// parse the request body as JSON
app.use(bodyParser.json({ type: 'application/fhir+json' }));

app.use(cors({
  exposedHeaders: ['Content-Range']
 }));

app.use('/', router);

//Server PORT
db.sequelize.sync({}).then((req) => {
    app.listen(privateConfig.appConfig.PORT, (err) => {
    if (err) console.log(`Error: ${err}`)
    console.log(`${privateConfig.appConfig.mediatorName}  listening on port ${privateConfig.appConfig.PORT}...  \n`);
});
}).then(() => {
    console.log(`Succesfully connected to '${privateConfig.development.database}' database...  \n`)
}).catch(err => { console.log(`Error when connecting to '${privateConfig.development.database}' database...:: \n`, err) });