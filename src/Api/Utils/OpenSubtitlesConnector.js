/* eslint-disable linebreak-style */
const OS = require('opensubtitles-api');
const settings = require('../OpenSub/settings.json');

class OpenSubtitlesConnector {
  constructor(imdbId) {
    this.openSubApi = new OS(settings);
    this.movieImdbId = imdbId;
  }

  getSubtitle() {
    return new Promise((resolve, reject) => {
      this.openSubApi.login()
        .then(() => {
          this.searchSubtitle().then((sub) => {
            const allSubs = [];
            sub.ro.forEach((element) => {
              allSubs.push(element.vtt);
            });
            resolve(allSubs);
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  searchSubtitle() {
    return new Promise((resolve, reject) => {
      this.openSubApi.search({
        sublanguageid: 'rum',
        imdbid: this.movieImdbId,
        limit: 'all',
        gzip: true
      }).then((subtitles) => {
        resolve(subtitles);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

export default OpenSubtitlesConnector;
