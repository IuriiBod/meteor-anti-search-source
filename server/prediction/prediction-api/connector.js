var CloudSettings = Meteor.settings.private.GoogleCloud;

var TRAINING_DATA_FILE_NAME = "sales-data.csv";
var modelName = "trainingModel";
var project = 'HospoHero';
var inputVector = ["6GnZhJRYfH7G9Licg", 25, "Sun", 33];


PredictionApi = {
  auth: function () {
    var authOptions = {
      serviceEmail: CloudSettings.SERVICE_EMAIL,
      pemFile: CloudSettings.PEM_FILE,
      projectName: 'HospoHero'
    };

    var googlePrediction = new GooglePrediction(authOptions);
    return googlePrediction
    //return googlePrediction.predict(modelName, inputVector);
  }
};