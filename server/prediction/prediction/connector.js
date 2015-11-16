GooglePredictionApi = function GooglePredictionApi(locationId) {
  var cloudSettings = Meteor.settings.GoogleCloud;
  var authOptions = {
    serviceEmail: cloudSettings.SERVICE_EMAIL,
    pemFile: cloudSettings.PEM_FILE,
    projectName: 'HospoHero'
  };

  this._client = new GooglePrediction(authOptions);
  this._locationId = locationId;
  this._bucketName = cloudSettings.BUCKET
};

GooglePredictionApi.prototype._getModelName = function () {
  return "trainingModel-" + this._locationId;
};

GooglePredictionApi.prototype._getTrainingFileName = function () {
  return "sales-data-" + this._locationId + ".csv";
};

/**
 * Updates prediction model for current location
 *
 */
GooglePredictionApi.prototype.updatePredictionModel = function () {
  var location = Locations.findOne({_id: this._locationId});

  logger.info('Updating prediction model', {locationId: this._locationId});

  //find out if we need to update prediction model (every half year)
  var lastForecastModelUploadDate = location.lastForecastModelUploadDate || false;

  var needToUpdateModel = !lastForecastModelUploadDate
    || moment(lastForecastModelUploadDate) < moment().subtract(182, 'day');

  if (needToUpdateModel) {
    var trainingFileName = this._getTrainingFileName();
    var googleCloud = new GoogleCloud(this._locationId, trainingFileName);

    //upload daily sales data into file in google cloud storage
    googleCloud.uploadSalesData();

    var predictionModelName = this._getModelName();
    this._client.insert(predictionModelName, this._bucketName, trainingFileName);

    //refresh update date
    Locations.update({_id: location._id}, {$set: {lastForecastModelUploadDate: new Date()}});
    logger.info('Started training prediction model', {name: predictionModelName});
  } else {
    logger.info("Model don't need update", {locationId: this._locationId, lastUpdatedAt: lastForecastModelUploadDate});
  }
};

/**
 * Uses google prediction generated model to make prediction for specified menu item and date
 *
 * @param inputData
 * @returns {*}
 */
GooglePredictionApi.prototype.makePrediction = function (inputData) {

  var predictedValue = parseInt(this._client.predict(this._getModelName(), inputData).outputValue);
  if (predictedValue < 0) {
    predictedValue = 0;
  }

  logger.info('Made prediction', {menuItemId: inputData[0], value: predictedValue});

  return predictedValue;
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
      return model.id === modelName;
    });

    if (modelToRemove) {
      this._client.remove(modelName);
      var trainingFileName = this._getTrainingFileName();

      //remove file from cloud storage
      var googleCloud = GoogleCloud(this._locationId, trainingFileName);
      googleCloud.removeModelFile();
    }
  }
};


//mock mix-in for prediction API
if (HospoHero.isDevelopmentMode()) {
  _.extend(GooglePredictionApi.prototype, {
    makePrediction: function () {
      return Math.floor(Math.random() * 100);
    },
    _getModelName: function () {
      return "trainingModel"
    },

    _getTrainingFileName: function () {
      return "sales-data.csv"
    }
  });
}