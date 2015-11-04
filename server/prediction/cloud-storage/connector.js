GoogleCloud = function GoogleCloud(locationId, trainingFileName) {
  this._locationId = locationId;

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

  this.MAX_UPLOADED_DAYS_COUNT = 365;
};


GoogleCloud.prototype.uploadSalesData = function () {
  var trainingDataWriteStream = new through();
  trainingDataWriteStream.pipe(this._cloudFile.createWriteStream());

  var predictionModelDataGenerator = new PredictionModelDataGenerator(this._locationId);

  var uploadedDaysCount = 0;
  var currentDateMoment = moment().subtract(1, 'day');

  while (uploadedDaysCount < this.MAX_UPLOADED_DAYS_COUNT) {

    var dailySalesCursor = DailySales.find({
      'relations.locationId': this._locationId,
      date: TimeRangeQueryBuilder.forDay(currentDateMoment)
    });

    dailySalesCursor.forEach(function (dailySale) {
      var csvLine = predictionModelDataGenerator.getDataForSale(dailySale);
      trainingDataWriteStream.push(csvLine);
    });

    currentDateMoment.subtract(1, 'day');
    uploadedDaysCount++;
  }

  trainingDataWriteStream.end();
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
 * @param locationId
 * @constructor
 */
PredictionModelDataGenerator = function PredictionModelDataGenerator(locationId) {
  this._locationId = locationId;
  this._weatherManager = new WeatherManager(locationId);
  this._weatherManager.updateHistorical();

  //primitive weather caching
  this._currentWeather = this._weatherManager.getWeatherFor(moment().subtract(1, 'day'));
};


PredictionModelDataGenerator.prototype._getWeatherForSale = function (dailySale) {
  if (!moment(dailySale.date).isSame(this._currentWeather.date, 'day')) {
    this._currentWeather = this._weatherManager.getWeatherFor(dailySale.date);
  }
  return this._currentWeather;
};


PredictionModelDataGenerator.prototype.getDataForSale = function (dailySale) {
  var dayOfYear = moment(dailySale.date).dayOfYear();

  var weather = this._getWeatherForSale(dailySale);

  return dailySale.actualQuantity + ', "' + dailySale.menuItemId + '", ' +
    weather.temp + ', "' + weather.main + '", ' + dayOfYear + '\n';
};