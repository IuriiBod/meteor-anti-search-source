var CloudSettings = Meteor.settings.private.GoogleCloud;
var PredictionClient = Meteor.npmRequire('node-google-prediction');
var TRAINING_DATA_FILE_NAME = "sales-data.csv";

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
  },

  insert: function () {
    var project = 'HospoHero';
    var getUrl = function (project) {
      return 'https://www.googleapis.com/prediction/v1.6/projects/' + project + '/trainedmodels';
    };
    var authCredentials = this.auth();
    try {
      var result = HTTP.post(getUrl(project), {
        headers: {
          "Content-Type": "application/json",
          "Authorization": authCredentials.token_type + ' ' + authCredentials.access_token
        },
        data:{
          id: "trainingModel",
          storageDataLocation: CloudSettings.BUCKET +"/" + TRAINING_DATA_FILE_NAME
        }
      });
      console.log(result);
    } catch (err) {
      logger.error('Error while accessing prediction api', err);
    }
  },

  get: function() {
    var project = 'HospoHero';
    var modelName = "trainingModel"
    var getUrl = function (project, modelName) {
      return 'https://www.googleapis.com/prediction/v1.6/projects/' + project + '/trainedmodels/' + modelName;
    };
    var authCredentials = this.auth();
    try {
      var result = HTTP.get(getUrl(project, modelName), {
        headers: {
          "Content-Type": "application/json",
          "Authorization": authCredentials.token_type + ' ' + authCredentials.access_token
        }
      });
      console.log(result);
    } catch (err) {
      logger.error('Error while accessing prediction api', err);
    }
  },
  predict: function() {
    var project = 'HospoHero';
    var modelName = "trainingModel"
    var getUrl = function (project, modelName) {
      return 'https://www.googleapis.com/prediction/v1.6/projects/' + project + '/trainedmodels/' + modelName + "/predict";
    };
    var authCredentials = this.auth();
    try {
      var result = HTTP.post(getUrl(project, modelName), {
        headers: {
          "Content-Type": "application/json",
          "Authorization": authCredentials.token_type + ' ' + authCredentials.access_token
        },
        data: {
          "input": {
            "csvInstance": ["XrXkqcvZZQ8viZCeY", 7, "Rain", 261]
          }
        }
      });
      console.log(result);
    } catch (err) {
      logger.error('Error while accessing prediction api', err);
    }
  }
};

Meteor.methods({
  'dataTraining': function(){
    PredictionApi.insert();
  },
  'getModelInfo': function(){
    PredictionApi.get();
  },
  'predict': function(){
    PredictionApi.predict();
  }
});