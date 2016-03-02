GooglePredictionApi = function GooglePredictionApi(locationId) {
  var cloudSettings = Meteor.settings.GoogleCloud;
  var authOptions = {
    serviceEmail: cloudSettings.SERVICE_EMAIL,
    pemFile: cloudSettings.PEM_FILE,
    projectName: cloudSettings.PROJECT_NAME
  };

  this._client = new GooglePrediction(authOptions);
  this._locationId = locationId;
  this._bucketName = cloudSettings.BUCKET;
};


GooglePredictionApi.prototype._getModelName = (menuItemId) =>
  `${HospoHero.isDevelopmentMode() ? "dev-" : ""}menu-item-${menuItemId}`;


GooglePredictionApi.prototype._getTrainingFileName = (menuItemId) =>
  `${HospoHero.isDevelopmentMode() ? "dev-" : ""}menu-item-${menuItemId}.csv`;


GooglePredictionApi.prototype._buildPredictionModelForMenuItem = function (menuItem) {
  var trainingFileName = this._getTrainingFileName(menuItem._id);
  var googleCloud = new GoogleCloud(menuItem, trainingFileName);

  //upload daily sales data into file in google cloud storage
  googleCloud.uploadSalesData();

  var predictionModelName = this._getModelName(menuItem._id);
  this._client.insert(predictionModelName, this._bucketName, trainingFileName);
};

/**
 * Updates prediction model for current location
 *
 * @param menuItemsQuery MongoDB query for menu items prediction models need to be updated
 * @param isForcedUpdate forces model update even if it don't need update
 */
GooglePredictionApi.prototype.updatePredictionModel = function (menuItemsQuery, isForcedUpdate) {
  var location = Locations.findOne({_id: this._locationId});
  logger.info('Building prediction models for locations', {locationId: this._locationId});

  var targetMenuItems = MenuItems.find(menuItemsQuery, {
    fields: {
      _id: 1,
      name: 1,
      lastForecastModelUpdateDate: 1,
      relations: 1
    }
  });

  var self = this;
  targetMenuItems.forEach(function (menuItem) {
    //find out if we need to update prediction model (every half year)
    var lastForecastModelUpdateDate = menuItem.lastForecastModelUpdateDate || false;

    var needToUpdateModel = !lastForecastModelUpdateDate ||
      moment(lastForecastModelUpdateDate).add(182, 'day').isBefore(moment());

    if (needToUpdateModel || isForcedUpdate) {
      self._buildPredictionModelForMenuItem(menuItem);

      //refresh update date
      MenuItems.update({_id: location._id}, {$set: {lastForecastModelUpdateDate: new Date()}});
    } else {
      logger.info("Model don't need update", {
        menuItemId: menuItem._id,
        lastUpdatedAt: lastForecastModelUpdateDate
      });
    }
  });

  logger.info('Finished building prediction models');
};

/**
 * Uses google prediction generated model to make prediction for specified menu item and date
 *
 * @param menuItemId
 * @param inputData
 * @returns {*}
 */
GooglePredictionApi.prototype.makePrediction = function (menuItemId, inputData) {
  var modelName = this._getModelName(menuItemId);
  var predictionResult = this._client.predict(modelName, inputData);

  var predictedValue = parseInt(predictionResult.outputValue);
  if (predictedValue < 0) {
    predictedValue = 0;
  }
  return predictedValue;
};

/**
 * The current status of the training job. This can be one of following:
 * RUNNING - Only returned when retraining a model; for a new model, a
 * trainedmodels.get call will return HTTP 200 before training is complete.
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
GooglePredictionApi.prototype.getModelStatus = function (menuItemId) {
  return this._client.get(this._getModelName(menuItemId)).trainingStatus;
};

/**
 * Remove prediction model includes also removing related CSV file in cloud storage
 *
 * @param menuItemId
 */
GooglePredictionApi.prototype.removePredictionModel = function (menuItemId) {
  var modelName = this._getModelName(menuItemId);
  var modelsList = this._client.list();

  if (modelsList.items) {
    var modelToRemove = _.find(modelsList.items, function (model) {
      return model.id === modelName;
    });

    if (modelToRemove) {
      this._client.remove(modelName);
      var trainingFileName = this._getTrainingFileName();

      var menuItem = MenuItems.findOne({_id: menuItemId});

      //remove file from cloud storage
      var googleCloud = GoogleCloud(menuItem, trainingFileName);
      googleCloud.removeModelFile();
    }
  }
};

/**
 * Service method, may be used to clean up after some global
 * configuration changes
 *
 * @private
 */
GooglePredictionApi.prototype._removeAllPredictionModels = function () {
  var modelsList = this._client.list();

  if (_.isArray(modelsList.items)) {
    var self = this;
    modelsList.items.forEach(function (model) {
      self._client.remove(model.id);
      logger.warn('Removed prediction model ', {name: model.id});
    });
  }
};