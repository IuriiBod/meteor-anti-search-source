var component = FlowComponents.define('predictionSalesCell', function (props) {
  this.dailySale = props.displayItem;

  console.log(this.dailySale);

  this.set('predictionQuantity', props.displayItem.predictionQuantity);
  this.set('actualQuantity', props.displayItem.actualQuantity);
});

component.state.isFuturePrediction = function () {
  var dailySaleDate = new Date(this.dailySale.date);
  return moment().startOf('day').isBefore(dailySaleDate);
};

component.state.onPredictedValueChangedCb = function () {
  var self = this;

  return function (newValue) {
    var numberVal = parseInt(newValue);

    if (_.isNumber(numberVal)) {
      var currentDate = new Date(self.dailySale.date);
      Meteor.call('editForecast', currentDate, numberVal, HospoHero.handleMethodResult());
    }
  };
};