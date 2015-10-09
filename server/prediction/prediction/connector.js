var CloudSettings = Meteor.settings.GoogleCloud;


GooglePredictionApi = function GooglePredictionApi() {
  var authOptions = {
    serviceEmail: CloudSettings.SERVICE_EMAIL,
    pemFile: CloudSettings.PEM_FILE,
    projectName: 'HospoHero'
  };
  this._client = new GooglePrediction(authOptions);
};


GooglePredictionApi.prototype._getModelName = function (locationId) {
  if (HospoHero.isDevelopmentMode()) {
    return "trainingModel"
  }else{
    return "trainingModel-" + locationId;
  }
};


GooglePredictionApi.prototype._getTrainingFileName = function (locationId) {
  if (HospoHero.isDevelopmentMode()) {
    return "sales-data"
  }else{
    return "sales-data-" + locationId + ".csv";
  }

};


GooglePredictionApi.prototype.getUpdatePredictionModelSession = function (locationId) {
  var self = this;
  var onFinished = function () {
    //start learning
    self._client.insert(self._getModelName(locationId), CloudSettings.BUCKET, self._getTrainingFileName(locationId));
  };

  //uplaod data to google cloud storage
  return GoogleCloud.createTrainingDataUploadingSession(this._getTrainingFileName(locationId), onFinished);
};


GooglePredictionApi.prototype.makePrediction = function (inputData, locationId) {
  if (HospoHero.isDevelopmentMode()) {
    return Math.floor(Math.random() * 100);
  } else {
    return this._client.predict(this._getModelName(locationId), inputData).outputValue;
  }
};