var CloudSettings = Meteor.settings.GoogleCloud;


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


GooglePredictionApi.prototype.getUpdatePredictionModelSession = function () {
  var onFinished = (function () {
    //start learning
    this._client.insert(this._getModelName(), CloudSettings.BUCKET, this._getTrainingFileName());
  }).bind(this);

  //uplaod data to google cloud storage
  return GoogleCloud.createTrainingDataUploadingSession(onFinished);
};


GooglePredictionApi.prototype.makePrediction = function (inputData) {
  if (HospoHero.isDevelopmentMode()) {
    return Math.floor(Math.random() * 100);
  } else {
    return this._client.predict(this._getModelName(), inputData).outputValue;
  }
};