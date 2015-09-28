var CloudSettings = Meteor.settings.GoogleCloud;

CsvEntryGenerator = {
  generate: function (salesData, weather) {
    var csvString = '';
    var dayOfYear = moment(salesData.createdDate).dayOfYear();

    _.each(salesData.menuItems, function (selledCount, menuItemName) {
      //todo update code for organization
      var menuItem = MenuItems.findOne({revelName: menuItemName});
      if (!menuItem) {
        //try find by name
        //todo update code for organization
        menuItem = MenuItems.findOne({name: menuItemName});
      }

      if (menuItem) {
        csvString += selledCount + ', "' + menuItem._id + '", ' + weather.temp + ', "' + weather.main + '", ' + dayOfYear + '\n';
      } else {
        //otherwise ignore this data (we don't know which menu is it)
        logger.info('Appropriate menu item not found', {name: menuItemName});
      }
    });

    return csvString;
  }
};

GoogleCloud = {
  _googleCloud: new gcloud({
    projectId: CloudSettings.PROJECT_ID,
    credentials: {
      client_email: CloudSettings.SERVICE_EMAIL,
      private_key: Assets.getText(CloudSettings.PEM_FILE)
    }
  }),

  //todo update this code for one location
  //todo make unique files for different locations like: "sales-data-#{locationId}"
  uploadTrainingData: function (/*location*/) {
    var through = Meteor.npmRequire('through');
    var bucket = this._googleCloud.storage().bucket(CloudSettings.BUCKET);
    var trainingDataWriteStream = new through();

    trainingDataWriteStream.pipe(bucket.file(GooglePredictionApi.getTrainingFileName()).createWriteStream());

    logger.info('Starting uploading from POS');

    //upload sales training data for the last year
    Revel.uploadAndReduceOrderItems(function (salesData) {
      logger.info('Received daly sales', {date: salesData.createdDate});

      //todo replace location with "Location's" location
      //todo replace historyMock with history method
      var weather = OpenWeatherMap.historyMock(new Date(salesData.createdDate), Meteor.settings.Location);

      var csvEntriesForCurrentDay = CsvEntryGenerator.generate(salesData, weather);

      trainingDataWriteStream.push(csvEntriesForCurrentDay);

    }, function (uploadedDaysCount) {
      logger.info('Sales data uploading finished', {uploadedDaysCount: uploadedDaysCount});
      trainingDataWriteStream.end();
    }, 365);
  }
};