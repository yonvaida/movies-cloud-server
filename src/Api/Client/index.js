const express = require('express');
import MysqlConnector from '../Db/MysqlConnector/MysqlConnector';
import OneDriveConnector from '../Cloud/OneDriveConnector';
import OpenSubtitlesConnector from '../Utils/OpenSubtitlesConnector';
import MongoConnector from '../Db/MongoConnector';

const clientApi = express();
const connector = new OneDriveConnector();
let dbConnector = new MongoConnector();


clientApi.get('/allMovies',(req,res) => { 
  dbConnector.getAllMovies().then((response)=>{
    res.send(response);
  }).catch((err)=>{
    console.log(err);
  })
})
/*
clientApi.get('/oneDriveList', (req, res) => {
  connector.getMoviesList().then((successMessage) => {
    res.send(JSON.stringify(successMessage));
  });
});
*/
clientApi.get('/allMovies', (req, res) => {
  dbConnector.getAllMovies().then((response)=>{
    res.send(response);
  }).catch((err)=>{
    console.log(err);
  })
});

clientApi.post('/oneDriveShareLink', (req, res) => {
  connector.getMovieSharedLink(req.body.id)
    .then((response) => {
      res.send(response);
    }).catch((err) => {
      res.send(err);
    });
});

clientApi.post('/getMovieSubtitle', (req, res) => {
  const subConnector = new OpenSubtitlesConnector(req.body.imdbId);
  subConnector.getSubtitle().then((response) => {
    res.send(response);
  }).catch((err) => {
    res.send(err);
  });
});

clientApi.get('/refreshMoviesList', (req, res) => {
  connector.getMoviesList().then((successMessage) => {
    successMessage.forEach(element => {
      
      dbConnector.addMovie(element);

    });
    res.send(JSON.stringify(successMessage));
  });
})

clientApi.get('/testmongo',(req,res)=>{
  let connector = new MongoConnector();
  connector.insert();
  res.send("inserted");
})

export default clientApi;