Template.predictionSalesCell.helpers({
  isPredictionManual: function () {
    return !!this.manualPredictionQuantity;
  }
});


Template.predictionSalesCell.events({
  'click .remove-manual-prediction-button': function (event, tmpl) {
    if (confirm('Are you sure you want disable manual prediction for this item and date?')) {
      FlowComponents.callAction('removeManualPrediction');
    }
  }
});