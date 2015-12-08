var processMthodResult = function (err, res) {
  if (err) {
    alert(err);
  } else {
    alert(res);
  }
};


Template.forceForecast.onCreated(function () {
  console.log('oncreate', this);
  this.set('test', 'initial value');
});


Template.forceForecast.events({
  'click .import-raw': function (event, tmpl) {
    if (confirm('It will remove old raw data.\nAre you sure?')) {
      Meteor.call('importRawOrders', processMthodResult)
    }
  },

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
  },

  'click .test-btn': function (event, tmpl) {
    tmpl.set('test', 'clicked');
  }
});