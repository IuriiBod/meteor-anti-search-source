var component = FlowComponents.define('predictionSalesCell', function (props) {
  this.dailySale = props.displayItem;

  this.set('predictionQuantity', props.displayItem.predictionQuantity);
  this.set('actualQuantity', props.displayItem.actualQuantity);
});

component.state.isFuturePrediction = function () {
  var dailySaleDate = new Date(this.dailySale.date);
  var isFuture = moment().add(1, 'day').startOf('day').isBefore(dailySaleDate);
  if (this.dailySale.menuItemId === 'jfoKQtFhGxtGsrspC') {
    console.log(this.dailySale);
  }
  return isFuture;
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