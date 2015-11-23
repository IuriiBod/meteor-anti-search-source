var component = FlowComponents.define('predictionSalesCell', function (props) {
  this.set('predictionQuantity', props.displayItem.predictionQuantity);
  this.set('actualQuantity', props.displayItem.actualQuantity);
});

component.state.isFuturePrediction = function () {
  //todo: update with actual date
  return moment().startOf('day').isBefore(new Date());
};

component.state.onPredictedValueChangedCb = function () {
  var self = this;

  return function (newValue) {
    var numberVal = parseInt(newValue);

    console.log('changed value to ', numberVal);
    //if(_.isNumber(numberVal)){
    //  Meteor.call('editForecast',numberVal,HospoHero.handleMethodResult());
    //}
  };
};