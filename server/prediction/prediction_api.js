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

var CloudSettings = Meteor.settings.private.GoogleCloud;

Meteor.methods({
  getAuthToken: function () {
    var Client = Meteor.npmRequire('node-google-prediction');

    var client = new Client({
      claimSetISS: CloudSettings.SERVICE_EMAIL,
      //pem should be located in private directory
      path: assetsFolderAbsolutePath(CloudSettings.PEM_FILE)
    });

    var syncToken = Meteor.wrapAsync(client.accessTokenRequest, client);
    return syncToken()
  }
});