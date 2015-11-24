var component = FlowComponents.define('predictionSalesCell', function (props) {
  this.dailySale = props.displayItem;

  this.set('predictionQuantity', props.displayItem.predictionQuantity);
  this.set('actualQuantity', props.displayItem.actualQuantity);
});


component.state.isFuturePrediction = function () {
  var dailySaleDate = new Date(this.dailySale.date);
  return moment().add(1, 'day').startOf('day').isBefore(dailySaleDate);
};


component.state.onPredictedValueChangedCb = function () {
  var self = this;

  return function (newValue) {
    var numberVal = parseInt(newValue);

    if (_.isNumber(numberVal)) {
      var dailySale = self.dailySale;
      Meteor.call('editForecast', dailySale.menuItemId, dailySale.date, numberVal, HospoHero.handleMethodResult());
    }
  };
};