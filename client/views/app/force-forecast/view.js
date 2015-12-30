var processMethodResult = function (err, res) {
  if (err) {
    alert(err);
  } else {
    alert(res);
  }
};


Template.forceForecast.events({
  'click .import-raw': function (event, tmpl) {
    if (confirm('It will remove old raw data.\nAre you sure?')) {
      Meteor.call('importRawOrders', processMethodResult)
    }
  },

  'click .update-prediction': function (event, tmpl) {
    Meteor.call('updatePredictionModel', processMethodResult)
  },

  'click .get-status': function (event, tmpl) {
    Meteor.call('getPredictionModelStatus', processMethodResult)
  },

  'click .update-forecast': function (event, tmpl) {
    Meteor.call('updatePredictions', processMethodResult)
  },

  'click .reset-data': function (event, tmpl) {
    if (confirm('Resetting forecast data... \nAre you sure?')) {
      Meteor.call('resetForecastData', processMethodResult);
    }
  }
});