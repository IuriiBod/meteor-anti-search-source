GoogleCloud = function GoogleCloud(menuItemId, trainingFileName) {
  this._menuItem = MenuItems.findOne({_id: menuItemId}, {fields: {name: 1, relations: 1}});

  var cloudSettings = Meteor.settings.GoogleCloud;

  var googleCloud = new gcloud({
    projectId: cloudSettings.PROJECT_ID,
    credentials: {
      client_email: cloudSettings.SERVICE_EMAIL,
      private_key: Assets.getText(cloudSettings.PEM_FILE)
    }
  });

  var bucket = googleCloud.storage().bucket(cloudSettings.BUCKET);

  this._cloudFile = bucket.file(trainingFileName);
};


GoogleCloud.prototype.uploadSalesData = function () {
  logger.info('Started uploading sales data on cloud storage', {
    menuItemId: this._menuItem._id,
    name: this._menuItem.name
  });

  var trainingDataWriteStream = new through();
  trainingDataWriteStream.pipe(this._cloudFile.createWriteStream());

  var predictionModelDataGenerator = new PredictionModelDataGenerator(this._menuItem);

  var yearDateRange = TimeRangeQueryBuilder.forInterval(moment().substract(1, 'year'), moment());

  var yearSaleCursor = DailySales.find({
    menuItemId: this._menuItem._id,
    actualQuantity: {$gte: 0},
    date: yearDateRange
  });

  yearSaleCursor.forEach(function (dailySale) {
    var csvLine = predictionModelDataGenerator.getDataForSale(dailySale);
    if (csvLine) {
      trainingDataWriteStream.push(csvLine);
    }
  });

  trainingDataWriteStream.end();

  logger.info('Finished uploading sales data', {menuItemId: this._menuItem._id});
};


GoogleCloud.prototype.removeModelFile = function () {
  this._cloudFile.delete(function (err, apiResponse) {
    if (err) {
      logger.error('error while removing training file', {error: err});
    }
  });
};


/**
 * Used to generate CSV data for prediction model
 * @param menuItem
 * @constructor
 */
PredictionModelDataGenerator = function PredictionModelDataGenerator(menuItem) {
  this._menuItem = menuItem;
  this._locationId = menuItem.relations.locationId;

  this._weatherManager = new WeatherManager(this._locationId);

  this._weatherManager.updateHistorical();
};


PredictionModelDataGenerator.prototype._convertValueVectorToString = function (vector) {
  return vector.map(function (value) {
      if (_.isString(value)) {
        value = '"' + value + '"';
      }
      return value;
    }).join(', ') + '\n';
};


PredictionModelDataGenerator.prototype.getDataForSale = function (dailySale) {
  var localDateMoment = HospoHero.dateUtils.getDateMomentForLocation(dailySale.date, this._locationId);

  var weather = this._weatherManager.getWeatherFor(localDateMoment);

  if (!weather) {
    logger.error('Weather not found', {locationId: this._locationId, date: dailySale.date});
    return false;
  }

  var valuesVector = [
    dailySale.actualQuantity,
    weather.temp,
    weather.main,
    localDateMoment.format('ddd'),
    localDateMoment.dayOfYear()
  ];

  return this._convertValueVectorToString(valuesVector);
};