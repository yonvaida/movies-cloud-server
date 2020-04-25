import OneDriveConnector from './OneDrive/OneDriveConnector';
import OpenSubtitlesConnector from './OpenSub/OpenSubtitlesConnector';
import MysqlConnector from './MysqlConnector/MysqlConnector';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const connector = new OneDriveConnector();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(cors());

app.get('/oneDriveList', (req, res) => {
  connector.getMoviesList().then((successMessage) => {
    res.send(JSON.stringify(successMessage));
  });
});

app.post('/oneDriveShareLink', (req, res) => {
  connector.getMovieSharedLink(req.body.id)
    .then((response) => {
      res.send(response);
    }).catch((err) => {
      res.send(err);
    });
});

app.post('/getMovieSubtitle', (req, res) => {
  const subConnector = new OpenSubtitlesConnector(req.body.imdbId);
  subConnector.getSubtitle().then((response) => {
    res.send(response);
  }).catch((err) => {
    res.send(err);
  });
});

app.get('/refreshMoviesList',(req,res) => {
  let dbConnector = new MysqlConnector();
  dbConnector.addMovie("Outlander", 2018);
  res.send('updated');
})

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));