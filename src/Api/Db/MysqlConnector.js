const mysql = require('mysql');
const settings = require('./settings.json');

class MysqlConnector {
  constructor() {
    this.connection =
      mysql.createConnection(settings);
  }

  addMovie(movieInfo) {
      this.connection.query(
        `INSERT INTO Movies.movies_list (title, year , webUrl, onedrive_id)
        VALUES ("${movieInfo.title}", ${movieInfo.year}, "${movieInfo.webUrl}","${movieInfo.id}")`,(err, res) => {
        if(err) {
          if (err.errno !== 1062){
            console.log(err);
          }
        } else
        {
          console.log('Last insert ID:', res.insertId);
        }
      })
  }

  getAllMovies() {
    return new Promise((resolve, reject) => {
      this.connection.query('Select * from Movies.movies_list',
        (err,res) => {
          if(err){
            reject(err);
          }
            resolve(res);
      });
    });
  }
}
export default MysqlConnector;