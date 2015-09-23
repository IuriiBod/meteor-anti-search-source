var CloudSettings = Meteor.settings.private.GoogleCloud;

//todo: extract this all stuff into config or update for locations functionality
var fileName = "sales-data.csv";
var modelName = "trainingModel";
var inputVector = ["6GnZhJRYfH7G9Licg", 25, "Sun", 33];


PredictionApi = {
  test: function () {
    var authOptions = {
      serviceEmail: CloudSettings.SERVICE_EMAIL,
      pemFile: CloudSettings.PEM_FILE,
      projectName: 'HospoHero'
    };

    var googlePrediction = new GooglePrediction(authOptions);

    return googlePrediction.predict(modelName, inputVector);
  }
};



