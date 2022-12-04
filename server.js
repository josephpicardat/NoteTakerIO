const express = require('express');
const api = require('./routes/apiRoutes.js'); // api has to be above html because otherwise the error: 'Uncaught (in promise) SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON' shows
const html = require('./routes/htmlRoutes.js');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// these are the two main routes for app. '/' displays normal html data while '/api/ transports the data
app.use('/api', api);
app.use('/', html);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`),
);
