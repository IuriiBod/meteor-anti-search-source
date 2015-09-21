var CloudSettings = Meteor.settings.private.GoogleCloud;
var PredictionClient = Meteor.npmRequire('node-google-prediction');

PredictionApi = {
  auth: function () {
    this._client = new PredictionClient({
      claimSetISS: CloudSettings.SERVICE_EMAIL,
      //pem should be located in private directory
      path: this._assetsFolderAbsolutePath(CloudSettings.PEM_FILE)
    });
    var syncToken = Meteor.wrapAsync(this._client.accessTokenRequest, this._client);
    return syncToken()
  },

  _assetsFolderAbsolutePath: function (fileName) {
    var fs = Npm.require('fs');
    var path = Npm.require('path');

    var meteorRoot = fs.realpathSync(process.cwd() + '/../');

    var assetsFolder = meteorRoot + '/server/assets/app';

    if (fileName) {
      assetsFolder += '/' + fileName
    }

    return assetsFolder
  }
};