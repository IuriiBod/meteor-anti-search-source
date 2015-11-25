var component = FlowComponents.define('predictionSalesCell', function (props) {
  this.set('dailySale', props.displayItem);
});


component.state.isFuturePrediction = function () {
  var dailySaleDate = new Date(this.get('dailySale').date);
  return moment().add(1, 'day').startOf('day').isBefore(dailySaleDate);
};

component.state.predictionQuantity = function () {
  var sale = this.get('dailySale');
  return sale.manualPredictionQuantity || sale.predictionQuantity;
};


component.state.onPredictedValueChangedCb = function () {
  var self = this;

  return function (newValue) {
    var numberVal = parseInt(newValue);

    if (_.isNumber(numberVal)) {
      var dailySale = self.get('dailySale');
      Meteor.call('editForecast', dailySale.menuItemId, dailySale.date, numberVal, HospoHero.handleMethodResult());
    }
  };
};

component.action.removeManualPrediction = function () {
  var sale = this.get('dailySale');

  Meteor.call('removeManualForecast', sale._id, HospoHero.handleMethodResult());
};