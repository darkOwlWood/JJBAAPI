const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const { standRoute } = require('./routes/StandsRoute');
const { charactersRoute } = require('./routes/CharactersRoute');
const { logErrors, wrapErrors, errorHandler } = require('./utils/middleware/errorHandler');
const notFoundHandler = require('./utils/middleware/notFoundHandler');
const { config } = require('./config');

//PARSERS
app.use(bodyParser.json());

//ROUTES
standRoute(app);
charactersRoute(app);

//NOT FOUND
app.use(notFoundHandler);

//ERROR HANDLER
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port,() => console.log(`http://localhost:${config.port}`));