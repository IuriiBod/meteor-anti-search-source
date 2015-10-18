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
    return "sales-data-" + this._locationId + ".csv";
  }
};


GooglePredictionApi.prototype.getUpdatePredictionModelSession = function () {
  var self = this;
  var onFinished = function () {
    //start learning
    self._client.insert(self._getModelName(), CloudSettings.BUCKET, self._getTrainingFileName());
  };

  //uplaod data to google cloud storage
  return GoogleCloud.createTrainingDataUploadingSession(this._getTrainingFileName(), locationId, onFinished);
};


GooglePredictionApi.prototype.makePrediction = function (inputData) {
  if (HospoHero.isDevelopmentMode()) {
    return Math.floor(Math.random() * 100);
  } else {
    return this._client.predict(this._getModelName(), inputData).outputValue;
  }
};



/**
 * The current status of the training job. This can be one of following:
 * RUNNING - Only returned when retraining a model; for a new model, a trainedmodels.get call will return HTTP 200 before training is complete.
 * DONE
 * ERROR
 * ERROR: NO VALID DATA INSTANCES
 * ERROR: TRAINING JOB NOT FOUND
 * ERROR: TRAINING TIME LIMIT EXCEEDED
 * ERROR: TRAINING SYSTEM CAPACITY EXCEEDED
 * ERROR: TRAINING DATA FILE SIZE LIMIT ERROR
 * ERROR: STORAGE LOCATION IS INVALID
 * @returns {String} model status
 */
GooglePredictionApi.prototype.getModelStatus = function () {
  return this._client.get(this._getModelName()).trainingStatus;
};

/**
 * Remove prediction model includes also removing related CSV file in cloud storage
 */
GooglePredictionApi.prototype.removePredictionModel = function () {
  var modelName = this._getModelName();
  var modelsList = this._client.list();

  if (modelsList.items) {
    var modelToRemove = _.find(modelsList, function (model) {
      return model.id === modelName
    });

    if (modelToRemove) {
      this._client.remove(modelName);
      var trainingFileName = this._getTrainingFileName();
      GoogleCloud.removeTrainingDataFile(trainingFileName);
    }
  }
};
