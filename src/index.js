const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./Api/Client/swagger.json');

const app = express();

//import adminApi from './Api/Admin/index';
//import clientApi from './Api/Client/index';

app.use('/', express.static('dist/client'));
app.use('/admin', express.static('dist/admin'));
app.use(bodyParser.json());
app.use(cors());

//app.use('/api/admin', adminApi);
//app.use('/api/client', clientApi);
app.use('/api/client/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));