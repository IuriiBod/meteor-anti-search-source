var processMethodResult = function (err, res) {
  if (err) {
    alert(err);
  } else {
    alert(res);
  }
};


Template.forceForecast.events({
  'click .import-raw': function () {
    if (confirm('Are you sure?')) {
      Meteor.call('importRawOrders', processMethodResult);
    }
  },

  'click .update-prediction': function () {
    Meteor.call('updatePredictionModel', processMethodResult);
  },

  'click .get-status': function () {
    Meteor.call('getPredictionModelStatus', processMethodResult);
  },

  'click .update-forecast': function () {
    Meteor.call('updatePredictions', processMethodResult);
  }
});