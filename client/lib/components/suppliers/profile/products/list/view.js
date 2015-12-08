Template.productsList.events({
  'click .editProduct': function (event, tmpl) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisIngredientId", id);
    tmpl.$("#editIngredientModal").modal("show");
  }
});