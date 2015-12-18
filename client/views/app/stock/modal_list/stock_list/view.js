Template.stocksModalList.events({
  "keyup #searchText-box": _.throttle(function (e) {
    var text = $(e.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200),

  'click #addNewIng': function (event) {
    event.preventDefault();
    FlowComponents.callAction('showAddStockItemMenu');
  },
  //event for submitIngredient template
  'click #addIngredientBtn': function () {
    FlowComponents.callAction('hideAddStockItemMenu');
  },
  'click #cancel': function () {
    FlowComponents.callAction('hideAddStockItemMenu');
  }
});