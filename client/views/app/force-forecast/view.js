var processMthodResult = function (err, res) {
  if (err) {
    alert(err);
  } else {
    alert(res);
  }
};

Template.forceForecast.events({
  'click .update-prediction': function (event, tmpl) {
    Meteor.call('updatePredictionModel', processMthodResult)
  },

  'click .get-status': function (event, tmpl) {
    Meteor.call('getPredictionModelStatus', processMthodResult)
  },

  'click .update-forecast': function (event, tmpl) {
    Meteor.call('updatePredictions', processMthodResult)
  },

  'click .reset-data': function (event, tmpl) {
    if (confirm('Resetting forecast data... \nAre you sure?')) {
      Meteor.call('resetForecastData', processMthodResult);
    }
  }
});