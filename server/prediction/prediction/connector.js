var CloudSettings = Meteor.settings.private.GoogleCloud;


//todo: update for locations functionality
GooglePredictionApi = function GooglePredictionApi() {
  var authOptions = {
    serviceEmail: CloudSettings.SERVICE_EMAIL,
    pemFile: CloudSettings.PEM_FILE,
    projectName: 'HospoHero'
  };
  this._client = new GooglePrediction(authOptions);
};


GooglePredictionApi.prototype._getModelName = function (locationId) {
  return "trainingModel";
};


GooglePredictionApi.prototype._getTrainingFileName = function (locationId) {
  return "sales-data.csv";
};


GooglePredictionApi.prototype.updatePredictionModel = function () {
  //uplaod data to google cloud storage
  GoogleCloud.uploadTrainingData();
  //start learning
  this._client.insert(this._getModelName(), CloudSettings.BUCKET, this._getTrainingFileName());
};


GooglePredictionApi.prototype.makePrediction = function (inputData) {
  this._client.predict(this._getModelName(), inputData);
};