Template.forceForecast.events({
  'click .update-prediction': function (event, tmpl) {
    Meteor.call('updatePredictionModel', function (err, res) {
      if (err) {
        alert(err);
      } else {
        alert(res);
      }
    })
  },
  'click .get-status': function (event, tmpl) {
    Meteor.call('getPredictionModelStatus', function (err, res) {
      if (err) {
        alert(err);
      } else {
        alert(res);
      }
    })
  },
  'click .update-forecast': function (event, tmpl) {
    Meteor.call('updatePredictions', function (err, res) {
      if (err) {
        alert(err);
      } else {
        alert(res);
      }
    })
  }
});