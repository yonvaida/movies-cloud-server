const mysql = require('mysql');
const settings = require('./settings.json');

class MysqlConnector {
  constructor() {
    this.connection =
      mysql.createConnection(settings);
  }

  addMovie(title, year) {
      this.connection.query(
        `INSERT INTO Movies.movies_list (title, year)
        VALUES ("${title}", ${year})`,(err, res) => {
        if(err) {
          console.log(err);
        } else
        {
          console.log('Last insert ID:', res.insertId);
        }
      })
  }

  
}
export default MysqlConnector;