var CloudSettings = Meteor.settings.private.GoogleCloud;

PredictionApi = {
  test: function () {
    var authOptions = {
      serviceEmail: CloudSettings.SERVICE_EMAIL,
      pemFile: CloudSettings.PEM_FILE,
      projectName: 'HospoHero'
    };

    var googlePrediction = new GooglePrediction(authOptions);
    console.log(googlePrediction.list())
  }
};



