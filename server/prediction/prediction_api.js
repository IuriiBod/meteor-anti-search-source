assetsFolderAbsolutePath = function (fileName) {
  var fs = Npm.require('fs');
  var path = Npm.require('path');

  var meteorRoot = fs.realpathSync(process.cwd() + '/../');

  var assetsFolder = meteorRoot + '/server/assets/app';

  if (fileName) {
    assetsFolder += '/' + fileName
  }

  return assetsFolder
};

var PREDICTION_SETTINGS = Meteor.settings.private.Prediction;

Meteor.methods({
  getAuthToken: function () {
    var Client = Meteor.npmRequire('node-google-prediction');

    var client = new Client({
      claimSetISS: PREDICTION_SETTINGS.serviceEmail,
      //pem should be located in private directory
      path: assetsFolderAbsolutePath(PREDICTION_SETTINGS.pem)
    });

    var syncToken = Meteor.wrapAsync(client.accessTokenRequest, client);
    return syncToken()
  }
});