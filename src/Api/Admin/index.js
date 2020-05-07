const express = require('express');
import MysqlConnector from '../Db/MysqlConnector/MysqlConnector';

const adminApi = express();

adminApi.get('/allMovies',(req,res) => {
  let dbConnector = new MysqlConnector();
  dbConnector.getAllMovies().then((response)=>{
    res.send(response);
  }).catch((err)=>{
    console.log(err);
  })
})

export default adminApi;