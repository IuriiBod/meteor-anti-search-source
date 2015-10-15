var CloudSettings = Meteor.settings.GoogleCloud;


GooglePredictionApi = function GooglePredictionApi(locationId) {
  var authOptions = {
    serviceEmail: CloudSettings.SERVICE_EMAIL,
    pemFile: CloudSettings.PEM_FILE,
    projectName: 'HospoHero'
  };
  this._client = new GooglePrediction(authOptions);
  this._locationId = locationId;
};


GooglePredictionApi.prototype._getModelName = function () {
  if (HospoHero.isDevelopmentMode()) {
    return "trainingModel"
  } else {
    return "trainingModel-" + this._locationId;
  }
};


GooglePredictionApi.prototype._getTrainingFileName = function () {
  if (HospoHero.isDevelopmentMode()) {
    return "sales-data"
  } else {
    return "sales-data-" + this._locationId+ ".csv";
  }

};


GooglePredictionApi.prototype.getUpdatePredictionModelSession = function () {
  var self = this;
  var onFinished = function () {
    //start learning
    self._client.insert(self._getModelName(), CloudSettings.BUCKET, self._getTrainingFileName());
  };

  //uplaod data to google cloud storage
  return GoogleCloud.createTrainingDataUploadingSession(this._getTrainingFileName(),locationId, onFinished);
};


GooglePredictionApi.prototype.makePrediction = function (inputData) {
  if (HospoHero.isDevelopmentMode()) {
    return Math.floor(Math.random() * 100);
  } else {
    return this._client.predict(this._getModelName(), inputData).outputValue;
  }
};