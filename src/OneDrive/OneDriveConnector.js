/* eslint-disable linebreak-style */
const request = require('request');
const ptt = require('parse-torrent-title');
const settings = require('../OneDrive/settings.json');

class OneDriveConnector {
  constructor() {
    this.token = {};
    this.tokenRequestBody = {};
    this.token = {};
    this.tokenExpire = Date.now();
    this.moviesListRequest = {};
    this.movieShareLinkRequest = {}
  }

  readTokenSettings() {
    const tokenRequestBody = settings.oneDrive.tokenParams;
    this.tokenRequestCallOptions = {
      uri: 'https://login.microsoftonline.com/f5afe32a-6883-4499-9eb0-c557c57cf316/oauth2/v2.0/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: tokenRequestBody
    };
  }

  readMoviesListSettings() {
    this.moviesListRequest = {
      uri: `https://graph.microsoft.com/v1.0/me/drive/items/${settings.oneDrive.drive_id}/children`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  readCreateSharedLinkSettings(drive_id) {
    this.movieShareLinkRequest = {
      uri: `https://graph.microsoft.com/v1.0/me/drive/items/${drive_id}/createLink`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  getToken() {
    this.readTokenSettings();
    return new Promise((resolve, reject) => {
      if (Date.now() <= this.tokenExpire) {
        resolve(this.token);
      } else {
        request(this.tokenRequestCallOptions, (error, response, body) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            this.token = JSON.parse(body).access_token;
            const expires = JSON.parse(body).expires_in;
            this.tokenExpire = Date.now() + expires * 1000;
            resolve('Success');
          }
        });
      }
    });
  }

  getMoviesList() {
    return new Promise((resolve, reject) => {
      this.getToken().then(() => {
        this.readMoviesListSettings();
        request(this.moviesListRequest, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            const allMovies = [];
            JSON.parse(body).value.forEach((movie) => {
              const movieinfo = ptt.parse(movie.name);
              movieinfo.webUrl = movie.webUrl;
              movieinfo.id = movie.id;
              allMovies.push(movieinfo);
            });
            resolve(allMovies);
          }
        });
      })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getMovieSharedLink(movieId) {
    return new Promise((resolve, reject) => {
      this.getToken().then(() => {
        this.readCreateSharedLinkSettings(movieId);
        request(this.movieShareLinkRequest, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body).link.webUrl);
          }
        });
      });
    });
  }
}
export default OneDriveConnector;
