Template.stocktakeHeader.events({
  'click #startNewStocktake': function (event, tmpl) {
    event.preventDefault();
    FlowComponents.callAction('startStocktake', tmpl);
  }
});