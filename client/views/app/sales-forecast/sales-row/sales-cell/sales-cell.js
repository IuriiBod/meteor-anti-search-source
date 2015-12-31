Template.predictionSalesCell.helpers({
  isPredictionManual: function () {
    return !!this.manualPredictionQuantity;
  },

  onPredictedValueChangedCb: function () {
    var tmpl = Template.instance();

    return function (newValue) {
      var numberVal = parseInt(newValue);

      if (_.isNumber(numberVal)) {
        var dailySale = tmpl.data;
        Meteor.call('editForecast', dailySale.menuItemId, dailySale.date, numberVal, HospoHero.handleMethodResult());
      }
    };
  },

  predictionQuantity: function () {
    return this.manualPredictionQuantity || this.predictionQuantity;
  },

  isFuturePrediction: function () {
    var dailySaleDate = new Date(this.date);
    return moment().add(1, 'day').startOf('day').isBefore(dailySaleDate);
  },

  predictionAccuracy: function () {
    var prediction = this.predictionQuantity;
    var actual = this.actualQuantity;
    var isPossibleToCalculate = _.isNumber(prediction) && _.isNumber(actual) && actual !== 0;

    var accuracy;
    if (isPossibleToCalculate) {
      accuracy = Math.round(100 - Math.abs(actual - prediction) / actual * 100);
      if (accuracy < 0) {
        accuracy = 0;
      }
      accuracy = accuracy.toString() + '%';
    } else {
      accuracy = '-';
    }

    return accuracy;
  }
});


Template.predictionSalesCell.events({
  'click .remove-manual-prediction-button': function (event, tmpl) {
    if (confirm('Are you sure you want disable manual prediction for this item and date?')) {
      var sale = tmpl.data;

      Meteor.call('removeManualForecast', sale._id, HospoHero.handleMethodResult());
    }
  }
});