const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const { standRouter } = require('./routes/StandsRoute');
const { config } = require('./config');

//PARSERS
app.use(bodyParser.json());

//ROUTES
standRouter(app);

app.listen(config.port,() => console.log(`http://localhost:${config.port}`));