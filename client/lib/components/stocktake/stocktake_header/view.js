Template.stocktakeHeader.events({
  'click #startNewStocktake': function (event) {
    event.preventDefault();
    FlowComponents.callAction('startStocktake');
  }
});