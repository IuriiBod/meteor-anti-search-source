Template.stockCounting.events({
  'click .addStock': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  }
});