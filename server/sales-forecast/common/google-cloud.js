GoogleCloud = function GoogleCloud(menuItem, trainingFileName) {
  this._menuItem = menuItem;

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


GoogleCloud.prototype.uploadSalesData = function (uploadToFile = false) {
  logger.info('Started uploading sales data on cloud storage', {
    menuItemId: this._menuItem._id,
    name: this._menuItem.name
  });

  let trainingDataWriteStream = new through();

  if (!uploadToFile) {
    trainingDataWriteStream.pipe(this._cloudFile.createWriteStream());
  } else {
    let fs = Npm.require('fs');
    let csvFilePath = `${process.env.PWD}/menu-item-${this._menuItem.name}.csv`;
    trainingDataWriteStream.pipe(fs.createWriteStream(csvFilePath));
  }

  var predictionModelDataGenerator = new PredictionModelDataGenerator(this._menuItem);

  var locationId = this._menuItem.relations.locationId;
  var dateToStartUploadFrom = HospoHero.prediction.getDateThreshold(); // new Date() default
  var nowMoment = HospoHero.dateUtils.getDateMomentForLocation(dateToStartUploadFrom, locationId);
  var indexMoment = moment(nowMoment);


  var guaranteeDailySale = function (dailySale) {
    if (!dailySale) {
      dailySale = {
        actualQuantity: 0,
        date: moment(indexMoment).toDate()
      };
    }
    return dailySale;
  };

  while (nowMoment.diff(indexMoment, 'days') <= 365) {
    var dailySale = DailySales.findOne({
      menuItemId: this._menuItem._id,
      actualQuantity: {$gte: 0},
      date: TimeRangeQueryBuilder.forDay(indexMoment)
    });

    var csvLine = predictionModelDataGenerator.getDataForSale(guaranteeDailySale(dailySale));

    if (csvLine) {
      trainingDataWriteStream.push(csvLine);
    }

    indexMoment.subtract(1, 'day');
  }

  trainingDataWriteStream.end();

  logger.info('Finished uploading sales data', {menuItemId: this._menuItem._id});
};


GoogleCloud.prototype.removeModelFile = function () {
  this._cloudFile.delete(function (err) {
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
var PredictionModelDataGenerator = function PredictionModelDataGenerator(menuItem) {
  this._menuItem = menuItem;
  this._locationId = menuItem.relations.locationId;
  this._location = Locations.findOne({_id: this._locationId});

  this._weatherManager = new WeatherManager(this._locationId);

  this._weatherManager.updateHistorical();
};


PredictionModelDataGenerator.prototype._convertValueVectorToString = function (vector) {
  return vector.map(value => _.isNumber(value) ? value : '"' + value + '"').join(', ') + '\n';
};


PredictionModelDataGenerator.prototype.getDataForSale = function (dailySale) {
  var localDateMoment = HospoHero.dateUtils.getDateMomentForLocation(dailySale.date, this._location);

  var weather = this._weatherManager.getWeatherFor(localDateMoment);

  if (!weather) {
    logger.error('Weather not found', {locationId: this._locationId, date: dailySale.date});
    return false;
  }

  let dataVector = new DataVector(localDateMoment, weather);

  return this._convertValueVectorToString(dataVector.getTrainingData(dailySale));
};